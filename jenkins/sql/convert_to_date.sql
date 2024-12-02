-- DROP FUNCTION public.convert_to_date(text, int4);

CREATE OR REPLACE FUNCTION public.convert_to_date(month_text text, year_num integer)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    month_num INT;
	date_num INT;
    result_date TEXT;
BEGIN
    -- Check if month_text contains a dot separator
    IF format_date(month_text) LIKE '%.%' THEN
        month_num := to_number(split_part(format_date(month_text), '.', 2), '99');
		date_num := to_number(split_part(format_date(month_text), '.', 1), '99');
    ELSE
        month_num := CASE LOWER(month_text)
            WHEN 'январь' THEN 1 
            WHEN 'январь-январь' THEN 1 
            WHEN 'на начало квартала' THEN 1 
            WHEN 'на начало отчетного года' THEN 1 
            WHEN '' THEN 1 
            WHEN 'ежегодно' THEN 1 
            WHEN 'на начало года' THEN 1
            ---------------------------------
            WHEN 'февраль' THEN 2 
            WHEN 'январь-февраль' THEN 2
            ---------------------------------
            WHEN 'март' THEN 3 
            WHEN 'январь-март' THEN 3 
            WHEN 'i квартал' THEN 3
            ---------------------------------
            WHEN 'апрель' THEN 4 
            WHEN 'январь-апрель' THEN 4
            ---------------------------------
            WHEN 'май' THEN 5 
            WHEN 'январь-май' THEN 5
            ---------------------------------
            WHEN 'июнь' THEN 6 
            WHEN 'январь-июнь' THEN 6 
            WHEN 'ii квартал' THEN 6
            WHEN 'i-ii квартал' THEN 6
            WHEN 'i полугодие' THEN 6
            ---------------------------------
            WHEN 'июль' THEN 7 
            WHEN 'январь-июль' THEN 7
            ---------------------------------
            WHEN 'август' THEN 8 
            WHEN 'январь-август' THEN 8
            ---------------------------------
            WHEN 'сентябрь' THEN 9 
            WHEN 'январь-сентябрь' THEN 9
            WHEN 'iii квартал' THEN 9
            WHEN 'i-iii квартал' THEN 9
            WHEN 'на начало учебного года' THEN 9
            ---------------------------------
            WHEN 'октябрь' THEN 10 
            WHEN 'январь-октябрь' THEN 10
            ---------------------------------
            WHEN 'ноябрь' THEN 11 
            WHEN 'январь-ноябрь' THEN 11
            ---------------------------------
            WHEN 'декабрь' THEN 12 
            WHEN 'январь-декабрь' THEN 12
            WHEN 'iv квартал' THEN 12 
            WHEN 'i-iv квартал' THEN 12 
            WHEN 'на конец года' THEN 12 
            WHEN 'ii полугодие' THEN 12
            WHEN 'значение показателя за год' THEN 12
            WHEN 'раз в год на определенную дату' THEN 12
            ---------------------------------
            ELSE null
        END;
    END IF;

    IF month_num IS NULL THEN
        RETURN NULL;
    END IF;

    -- Формируем дату в нужном формате
    IF date_num is not null THEN
        result_date := to_char(to_date(year_num || '-' || month_num || '-' || date_num, 'YYYY-MM-DD'), 'DD.MM.YYYY');
    ELSE
        result_date := to_char(to_date(year_num || '-' || month_num || '-01', 'YYYY-MM-DD'), 'DD.MM.YYYY');
    END IF;

    RETURN result_date;
END;
$function$
;