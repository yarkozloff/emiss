-- DROP FUNCTION public.get_datasets_by_search(text);

CREATE OR REPLACE FUNCTION public.get_datasets_by_search(search_query text)
 RETURNS TABLE(result_dataset integer, result_table_name text, result_rank real)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    (
        WITH ranked_datasets AS (
            SELECT ds.id AS dataset_id, 'datasets' AS table_name, 
                   ts_rank(ds."search", to_tsquery('russian', search_query)) AS rank 
            FROM datasets ds
            WHERE ds.search @@ to_tsquery('russian', search_query)

            UNION ALL

            SELECT ds.id AS dataset_id, 'codevals' AS table_name, tmp.rank AS rank
            FROM datasets ds
            INNER JOIN (
                SELECT o.dataset_id AS dataset_id, 
                       ts_rank(cdv."search", to_tsquery('russian', search_query)) AS rank 
                FROM codevals cdv
                INNER JOIN obs o ON cdv.id = o.code_id
                WHERE cdv.search @@ to_tsquery('russian', search_query)
            ) tmp ON tmp.dataset_id = ds.id

            UNION ALL

            SELECT ds.id AS dataset_id, 'codes' AS table_name, tmp.rank AS rank
            FROM datasets ds
            INNER JOIN (
                SELECT ds2.id AS dataset_id, 
                       ts_rank(cd."search", to_tsquery('russian', search_query)) AS rank 
                FROM codes cd
                INNER JOIN datasets ds2 ON cd.id = ds2.code_id
                WHERE cd.search @@ to_tsquery('russian', search_query)
            ) tmp ON tmp.dataset_id = ds.id

            UNION ALL

            SELECT ds.id AS dataset_id, 'classifier' AS table_name, tmp.rank AS rank
            FROM datasets ds
            INNER JOIN (
                SELECT ds3.id AS dataset_id, 
                       ts_rank(cl."search", to_tsquery('russian', search_query)) AS rank 
                FROM classifier cl
                INNER JOIN datasets ds3 ON cl.id = ds3.class_id
                WHERE cl.search @@ to_tsquery('russian', search_query)
            ) tmp ON tmp.dataset_id = ds.id

            UNION ALL

            SELECT ds.id AS dataset_id, 'agencies' AS table_name, tmp.rank AS rank
            FROM datasets ds
            INNER JOIN (
                SELECT ds4.id AS dataset_id, 
                       ts_rank(ag."search", to_tsquery('russian', search_query)) AS rank 
                FROM agencies ag
                INNER JOIN datasets ds4 ON ag.id = ds4.agency_id
                WHERE ag.search @@ to_tsquery('russian', search_query)
            ) tmp ON tmp.dataset_id = ds.id

            UNION ALL

            SELECT ds.id AS dataset_id, 'departments' AS table_name, tmp.rank AS rank
            FROM datasets ds
            INNER JOIN (
                SELECT ds5.id AS dataset_id, 
                       ts_rank(d."search", to_tsquery('russian', search_query)) AS rank 
                FROM departments d
                INNER JOIN datasets ds5 ON d.id = ds5.dept_id
                WHERE d.search @@ to_tsquery('russian', search_query)
            ) tmp ON tmp.dataset_id = ds.id

            UNION ALL

            SELECT ds.id AS dataset_id, 'periods' AS table_name, tmp.rank AS rank
            FROM datasets ds
            INNER JOIN (
                SELECT ds6.id AS dataset_id, 
                       ts_rank(p."search", to_tsquery('russian', search_query)) AS rank 
                FROM periods p
                INNER JOIN datasets ds6 ON p.id = ds6.period_id
                WHERE p.search @@ to_tsquery('russian', search_query)
            ) tmp ON tmp.dataset_id = ds.id

            UNION ALL

            SELECT ds.id AS dataset_id, 'units' AS table_name, tmp.rank AS rank
            FROM datasets ds
            INNER JOIN (
                SELECT ds7.id AS dataset_id, 
                       ts_rank(u."search", to_tsquery('russian', search_query)) AS rank 
                FROM units u
                INNER JOIN datasets ds7 ON u.id = ds7.unit_id
                WHERE u.search @@ to_tsquery('russian', search_query)
            ) tmp ON tmp.dataset_id = ds.id
        )

        SELECT dataset_id AS result_dataset, table_name, rank AS result_rank
        FROM (
            SELECT dataset_id, table_name, rank,
                   RANK() OVER (PARTITION BY dataset_id ORDER BY rank DESC) AS rnk
            FROM ranked_datasets
        ) subquery
        WHERE rnk = 1
    );
END;
$function$
;