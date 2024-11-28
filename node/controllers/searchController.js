const pool = require('../models/db'); // Импорт подключения к базе данных

// Эндпоинт для поиска по рубрике
exports.searchByClass = async (req, res) => {
  const { classid } = req.body;
  try {
    const additionalresult = await pool.query(`
    select 
        coalesce(codes."id", 0) as code_id,
        coalesce(ds."id", 0) as dataset_id,
        coalesce(ds."name", 'Нет данных') as "dataset_name", -- Имя статистики 
        coalesce(split_part(classifier."name", '/ ', 3), 'Нет данных') as "dataset_classifier", -- Имя рубрики
        substring(classifier."name" FROM position('/' IN classifier."name") + 1) as "name_class", -- Полное имя рубрики
        replace_substrings(coalesce(ds."description", 'Нет данных')) as "dataset_desc", -- Описание статистики
        coalesce(codes."name", 'Нет данных') as "dataset_class", -- Классификатор
        coalesce(agencies."name", 'Нет данных') as "dataset_agencie", -- Служба источник
        coalesce(departments."name", 'Нет данных') as "dataset_dep", -- Департамент
        coalesce(ds."prep_by", 'Нет данных') as "dataset_empl", -- Ответственный
        concat ('с ', coalesce(ds."range_start"::text, 'YYYY'), ' по ', coalesce(ds."range_end"::text, 'YYYY')) as "dataset_date" -- Период статистики
        from codes as codes -- Классификатор
        left join datasets ds on codes.id = ds.code_id -- Датасеты
        left join agencies agencies on ds.agency_id = agencies.id -- Организации
        left join departments departments on ds.dept_id = departments.id -- Подразделения
        left join classifier classifier on ds.class_id = classifier.id -- Рубрика
        where classifier."id" = \$1;
    `, [classid]);
    if (additionalresult.rows.length === 0) {
      return res.status(404).send('Данные не найдены');
    }
    res.json(additionalresult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при получении дополнительных данных');
  }
};

// Эндпоинт для поиска по классификатору
exports.searchByCodes = async (req, res) => {
  const { codeid } = req.body;
  try {
    const additionalresult = await pool.query(`
    select 
          coalesce(codes."id", 0) as code_id,
          coalesce(ds."id", 0) as dataset_id,
          coalesce(ds."name", 'Нет данных') as "dataset_name", -- Имя статистики 
          coalesce(split_part(classifier."name", '/ ', 3), 'Нет данных') as "dataset_classifier", -- Имя рубрики
          substring(classifier."name" FROM position('/' IN classifier."name") + 1) as "name_class", -- Полное имя рубрики
          replace_substrings(coalesce(ds."description", 'Нет данных')) as "dataset_desc", -- Описание статистики
          coalesce(codes."name", 'Нет данных') as "dataset_class", -- Классификатор
          coalesce(agencies."name", 'Нет данных') as "dataset_agencie", -- Служба источник
          coalesce(departments."name", 'Нет данных') as "dataset_dep", -- Департамент
          coalesce(ds."prep_by", 'Нет данных') as "dataset_empl", -- Ответственный
          concat ('с ', coalesce(ds."range_start"::text, 'YYYY'), ' по ', coalesce(ds."range_end"::text, 'YYYY')) as "dataset_date" -- Период статистики
          from codes as codes -- Классификатор
          left join datasets ds on codes.id = ds.code_id -- Датасеты
          left join agencies agencies on ds.agency_id = agencies.id -- Организации
          left join departments departments on ds.dept_id = departments.id -- Подразделения
          left join classifier classifier on ds.class_id = classifier.id -- Рубрика
          where codes."id" = \$1;
    `, [codeid]);
    if (additionalresult.rows.length === 0) {
      return res.status(404).send('Данные не найдены');
    }
    res.json(additionalresult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при получении дополнительных данных');
  }
};

// Эндпоинт для полнотекстового поиска
exports.searchByFulltext = async (req, res) => {
  const { query } = req.body;
  try {
    const additionalresult = await pool.query(`
    select distinct dataset_id, code_id, dataset_name, dataset_classifier,
        dataset_desc, dataset_class,dataset_agencie,dataset_dep,dataset_empl,dataset_date,rank
        FROM
            (select
            coalesce(codes."id", 0) as code_id,
            coalesce(ds."id", 0) as dataset_id,
            coalesce(ds."name", 'Нет данных') as "dataset_name", -- Имя статистики 
            coalesce(substring(classifier."name" FROM '^[^/]+/[^/]+/(.*)$'), 'Нет данных') as "dataset_classifier", -- Имя рубрики
            replace_substrings(coalesce(ds."description", 'Нет данных')) as "dataset_desc", -- Описание статистики
            coalesce(codes."name", 'Нет данных') as "dataset_class", -- Классификатор
            coalesce(agencies."name", 'Нет данных') as "dataset_agencie", -- Служба источник
            coalesce(departments."name", 'Нет данных') as "dataset_dep", -- Департамент
            coalesce(ds."prep_by", 'Нет данных') as "dataset_empl", -- Ответственный
            concat ('с ', coalesce(ds."range_start"::text, 'YYYY'), ' по ', coalesce(ds."range_end"::text, 'YYYY')) as "dataset_date", -- Период статистики
            (
            case ftx.result_table_name 
            when 'datasets' then concat ('Релевантность ', round(cast(ftx.result_rank as decimal)*100,2), '% по названию показателя')
            when 'codes' then concat ('Релевантность ', round(cast(ftx.result_rank as decimal)*100,2), '% по классификатору')
            when 'classifier' then concat ('Релевантность ', round(cast(ftx.result_rank as decimal)*100,2), '% по рубрике ведомства')
            when 'codevals' then concat ('Релевантность ', round(cast(ftx.result_rank as decimal)*100,2), '% по классификатору объекта')
            when 'units' then concat ('Релевантность ', round(cast(ftx.result_rank as decimal)*100,2), '% по единице измерения')
            when 'periods' then concat ('Релевантность ', round(cast(ftx.result_rank as decimal)*100,2), '% по названию периода')
            when 'agencies' then concat ('Релевантность ', round(cast(ftx.result_rank as decimal)*100,2), '% по названию ведомства')
            when 'departments' then concat ('Релевантность ', round(cast(ftx.result_rank as decimal)*100,2), '% по названию ведомтсва')
            else null
            end)
            as rank
            from datasets ds -- Классификатор
            inner join (select result_dataset,result_rank,result_table_name from get_datasets_by_search(\$1)) ftx on ds.id = ftx.result_dataset
            inner join codes codes on ds.code_id = codes.id -- Датасеты
            inner join agencies agencies on ds.agency_id = agencies.id -- Организации
            inner join departments departments on ds.dept_id = departments.id -- Подразделения
            inner join classifier classifier on ds.class_id = classifier.id -- Рубрика
            )
        order by rank desc;
    `, [`%${query}%`]);
    if (additionalresult.rows.length === 0) {
      return res.status(404).send('Данные не найдены');
    }
    res.json(additionalresult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при получении дополнительных данных');
  }
};

// Эндпоинт для поиска рубрик (от 3 символов)
exports.searchClassifier = async (req, res) => {
  const { query } = req.body;
  try {
    const result = await pool.query(`
    select
      c.id as id,
      substring(c."name" FROM position('/' IN c."name") + 1) as name
      from classifier c
      where id != 1
      and lower(substring(c."name" FROM position('/' IN c."name") + 1)) like lower(\$1);
    `, [`%${query}%`]);
    res.json({ results: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при выполнении поиска search');
  }
};

// Эндпоинт для поиска классификаторов (от 3 символов)
exports.searchCodes = async (req, res) => {
  const { query } = req.body;
  try {
    const result = await pool.query(`
    select id, name 
       from public.codes 
       where lower(name) like lower(\$1);
    `, [`%${query}%`]);
    res.json({ results: result.rows });
  } catch (err) {
    console.error(err);
    console.log(pool);
    res.status(500).send('Ошибка при выполнении поиска search');
  }
};

// Эндпоинт для методики
exports.getMethodic = async (req, res) => {
  const { codeId, datasetId } = req.body;
  try {
    const result = await pool.query(`
    select
          distinct cdv."name" as legend
          from codevals cdv
          inner join obs obs on cdv.id = obs.code_id
          inner join datasets ds on cdv.code_id = ds.code_id
          where cdv.code_id = \$1 and obs.dataset_id = \$2;
    `, [codeId, datasetId]);
    res.json({ methodics: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при выполнении поиска search');
  }
};

// Эндпоинт для obs
exports.getObs = async (req, res) => {
  const { codeId, datasetId } = req.body;
  try {
    const result = await pool.query(`
    select
          cdv."name" as legend,
          convert_to_date(p.val,obs.obs_year) as val_period,
          u.val as name_obs,
          obs.obs_val as val_obs
          from codevals cdv
          inner join obs obs on cdv.id = obs.code_id
          inner join periods p on obs.period_id = p.id
          inner join units u on obs.unit_id = u.id
          where cdv.code_id = \$1 and obs.dataset_id = \$2;
    `, [codeId, datasetId]);
    res.json({ results: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при выполнении поиска search');
  }
};
