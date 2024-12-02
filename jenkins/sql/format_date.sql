-- DROP FUNCTION public.format_date(text);

CREATE OR REPLACE FUNCTION public.format_date(input_date text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    day TEXT;
    month TEXT;
    month_number TEXT;
BEGIN
    IF input_date = '9 месяцев' THEN
        RETURN '1.09'; -- Возвращаем нужное значение
    END IF;
	IF input_date like '%2020%' THEN
        input_date := REGEXP_REPLACE(input_date, '\d+ неделя \(на (\d{1,2} \w+) \d{4} года\)', '\1');
    END IF;
    IF position('на ' IN input_date) > 0 THEN
        input_date := replace(input_date, 'на ', '');
    END IF;
    IF position('по ' IN input_date) > 0 THEN
        input_date := trim(split_part(input_date, 'по', 2));
    END IF;
    input_date := trim(input_date);
    day := split_part(input_date, ' ', 1);
    month := split_part(input_date, ' ', 2);
    IF day IS NULL OR month IS NULL THEN
        RETURN NULL; -- или можно вернуть сообщение об ошибке
    END IF;
    CASE month
        WHEN 'января' THEN month_number := '01';
        WHEN 'февраля' THEN month_number := '02';
        WHEN 'марта' THEN month_number := '03';
        WHEN 'апреля' THEN month_number := '04';
        WHEN 'мая' THEN month_number := '05';
        WHEN 'июня' THEN month_number := '06';
        WHEN 'июля' THEN month_number := '07';
        WHEN 'августа' THEN month_number := '08';
        WHEN 'сентября' THEN month_number := '09';
        WHEN 'октября' THEN month_number := '10';
        WHEN 'ноября' THEN month_number := '11';
        WHEN 'декабря' THEN month_number := '12';
        ELSE month_number := NULL; -- если месяц не распознан
    END CASE;
    IF month_number IS NULL THEN
        RETURN '';
    END IF;
    RETURN lower(day || '.' || month_number);
END;
$function$
;