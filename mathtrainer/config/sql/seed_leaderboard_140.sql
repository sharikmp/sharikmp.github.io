
DELETE FROM leaderboard_scores
WHERE anon_id LIKE 'ANON-SEED%';

INSERT INTO leaderboard_scores (
    anon_id,
    display_name,
    score,
    questions,
    accuracy,
    overall_level,
    country_code,
    country_name,
    is_anonymous,
    week_start,
    played_at,
    created_at,
    ip_hash,
    user_agent_hash
)
SELECT
    CONCAT('ANON-SEED', LPAD(s.n, 6, '0')) AS anon_id,
    CONCAT(LEFT(CONCAT(c.prefix, ' ', np.part), 20), '-', LPAD(s.n, 3, '0')) AS display_name,
    (100 + ((s.n * 17 + (s.n % 11) * 13) % 401)) AS score,
    (30 + ((s.n * 3) % 70)) AS questions,
    (72 + ((s.n * 5) % 28)) AS accuracy,
    (4 + ((s.n * 2) % 36)) AS overall_level,
    c.country_code,
    c.country_name,
    1 AS is_anonymous,
    DATE_SUB(UTC_DATE(), INTERVAL WEEKDAY(UTC_DATE()) DAY) AS week_start,
    DATE_SUB(UTC_TIMESTAMP(), INTERVAL ((s.n * 7) % 140) HOUR) AS played_at,
    DATE_SUB(UTC_TIMESTAMP(), INTERVAL ((s.n * 7) % 140) HOUR) AS created_at,
    SHA2(CONCAT('seed-ip-', s.n), 256) AS ip_hash,
    SHA2(CONCAT('seed-ua-', s.n), 256) AS user_agent_hash
FROM (
    SELECT (t.i * 10 + o.i) + 1 AS n
    FROM (
        SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
        UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13
    ) AS t
    CROSS JOIN (
        SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) AS o
    WHERE (t.i * 10 + o.i) < 140
) AS s
JOIN (
    SELECT 1 AS id, 'IN' AS country_code, 'India' AS country_name, 'Bharat' AS prefix
    UNION ALL SELECT 2,  'US', 'United States',   'Liberty'
    UNION ALL SELECT 3,  'GB', 'United Kingdom',  'Albion'
    UNION ALL SELECT 4,  'DE', 'Germany',         'Rhine'
    UNION ALL SELECT 5,  'AE', 'United Arab Emirates', 'Emir'
    UNION ALL SELECT 6,  'SA', 'Saudi Arabia',    'Desert'
    UNION ALL SELECT 7,  'CA', 'Canada',          'Maple'
    UNION ALL SELECT 8,  'AU', 'Australia',       'Outback'
    UNION ALL SELECT 9,  'FR', 'France',          'Paris'
    UNION ALL SELECT 10, 'ES', 'Spain',           'Iberia'
    UNION ALL SELECT 11, 'IT', 'Italy',           'Roma'
    UNION ALL SELECT 12, 'JP', 'Japan',           'Sakura'
    UNION ALL SELECT 13, 'SG', 'Singapore',       'Lion'
    UNION ALL SELECT 14, 'ZA', 'South Africa',    'Safari'
    UNION ALL SELECT 15, 'BR', 'Brazil',          'Samba'
    UNION ALL SELECT 16, 'MX', 'Mexico',          'Aztec'
    UNION ALL SELECT 17, 'NG', 'Nigeria',         'Naija'
    UNION ALL SELECT 18, 'TR', 'Turkey',          'Bosphor'
    UNION ALL SELECT 19, 'KR', 'South Korea',     'Seoul'
    UNION ALL SELECT 20, 'NL', 'Netherlands',     'Tulip'
) AS c
    ON c.id = CASE
        WHEN (s.n % 10) IN (1, 2, 3) THEN 1  -- India-heavy
        WHEN (s.n % 10) IN (4, 5, 6) THEN 2  -- USA-heavy
        ELSE (((s.n - 1) % 18) + 3)          -- distribute rest across other countries
    END
JOIN (
    SELECT 1 AS id, 'Aarav' AS part
    UNION ALL SELECT 2,  'Mason'
    UNION ALL SELECT 3,  'Oliver'
    UNION ALL SELECT 4,  'Lukas'
    UNION ALL SELECT 5,  'Omar'
    UNION ALL SELECT 6,  'Fahad'
    UNION ALL SELECT 7,  'Ethan'
    UNION ALL SELECT 8,  'Hugo'
    UNION ALL SELECT 9,  'Marco'
    UNION ALL SELECT 10, 'Kenji'
    UNION ALL SELECT 11, 'Yuki'
    UNION ALL SELECT 12, 'Chidi'
    UNION ALL SELECT 13, 'Bruno'
    UNION ALL SELECT 14, 'Diego'
    UNION ALL SELECT 15, 'Leo'
    UNION ALL SELECT 16, 'Noah'
    UNION ALL SELECT 17, 'Arjun'
    UNION ALL SELECT 18, 'Zayd'
    UNION ALL SELECT 19, 'Minho'
    UNION ALL SELECT 20, 'Niels'
) AS np
    ON np.id = ((s.n * 7 - 1) % 20) + 1;

SELECT country_code, country_name, COUNT(*) AS rows_per_country
FROM leaderboard_scores
WHERE anon_id LIKE 'ANON-SEED%'
GROUP BY country_code, country_name
ORDER BY rows_per_country DESC, country_code;

SELECT display_name, score, country_code, created_at
FROM leaderboard_scores
ORDER BY score DESC, created_at ASC
LIMIT 15;
