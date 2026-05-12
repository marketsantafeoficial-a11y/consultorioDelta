WITH space_resources AS (
  SELECT id
  FROM "Professional"
  WHERE lower(coalesce("fullName", '') || ' ' || coalesce("specialty", '')) LIKE '%consultorio%'
     OR lower(coalesce("fullName", '') || ' ' || coalesce("specialty", '')) LIKE '%oficina%'
     OR lower(coalesce("fullName", '') || ' ' || coalesce("specialty", '')) LIKE '%sala%'
     OR lower(coalesce("fullName", '') || ' ' || coalesce("specialty", '')) LIKE '%modulo%'
),
broad_schedules AS (
  SELECT s."professionalId", s."dayOfWeek"
  FROM "Schedule" s
  JOIN space_resources r ON r.id = s."professionalId"
  WHERE s."telehealth" = false
    AND s."startTime" = '08:00'
    AND s."endTime" = '20:00'
),
fixed_modules AS (
  SELECT '08:00'::text AS "startTime", '12:00'::text AS "endTime"
  UNION ALL
  SELECT '12:00'::text, '16:00'::text
  UNION ALL
  SELECT '16:00'::text, '20:00'::text
)
INSERT INTO "Schedule" ("dayOfWeek", "startTime", "endTime", "telehealth", "professionalId")
SELECT b."dayOfWeek", m."startTime", m."endTime", false, b."professionalId"
FROM broad_schedules b
CROSS JOIN fixed_modules m
WHERE NOT EXISTS (
  SELECT 1
  FROM "Schedule" existing
  WHERE existing."professionalId" = b."professionalId"
    AND existing."dayOfWeek" = b."dayOfWeek"
    AND existing."startTime" = m."startTime"
    AND existing."endTime" = m."endTime"
    AND existing."telehealth" = false
);

DELETE FROM "Schedule" s
USING "Professional" p
WHERE s."professionalId" = p.id
  AND s."telehealth" = false
  AND (
    lower(coalesce(p."fullName", '') || ' ' || coalesce(p."specialty", '')) LIKE '%consultorio%'
    OR lower(coalesce(p."fullName", '') || ' ' || coalesce(p."specialty", '')) LIKE '%oficina%'
    OR lower(coalesce(p."fullName", '') || ' ' || coalesce(p."specialty", '')) LIKE '%sala%'
    OR lower(coalesce(p."fullName", '') || ' ' || coalesce(p."specialty", '')) LIKE '%modulo%'
  )
  AND NOT (
    (s."startTime" = '08:00' AND s."endTime" = '12:00')
    OR (s."startTime" = '12:00' AND s."endTime" = '16:00')
    OR (s."startTime" = '16:00' AND s."endTime" = '20:00')
  );
