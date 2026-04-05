with country_bounds as (
  select
    116.9000::double precision as min_lng,
    126.6000::double precision as max_lng,
    4.6000::double precision as min_lat,
    21.2000::double precision as max_lat
),

incident_type_pool as (
  select row_number() over (order by name) as seq, id, name
  from public.incident_types
),

generated as (
  select
    gs.n,

    -- spread points across the whole country using a wide grid + slight randomness
    cb.min_lng
      + (((gs.n - 1) % 100) * ((cb.max_lng - cb.min_lng) / 99.0))
      + ((random() - 0.5) * ((cb.max_lng - cb.min_lng) / 250.0)) as lng,

    cb.min_lat
      + (floor((gs.n - 1) / 100) * ((cb.max_lat - cb.min_lat) / 49.0))
      + ((random() - 0.5) * ((cb.max_lat - cb.min_lat) / 180.0)) as lat,

    -- mostly low / moderate severity
    case
      when random() < 0.60 then 'low'
      when random() < 0.88 then 'moderate'
      when random() < 0.97 then 'high'
      else 'critical'
    end as severity,

    ((gs.n - 1) % (select count(*) from incident_type_pool)) + 1 as incident_type_seq
  from country_bounds cb
  cross join generate_series(1, 5000) as gs(n)
)

insert into public.incidents (
  incident_type_id,
  location,
  location_description,
  severity,
  description,
  status,
  incident_time
)
select
  it.id,
  ST_SetSRID(
    ST_MakePoint(g.lng, g.lat),
    4326
  )::geography,
  'Philippines',
  g.severity::public.incident_severity,
  it.name || ' reported somewhere in the Philippines (nationwide seed #' || g.n || ').',
  'new'::public.incident_status,
  now() - ((floor(random() * 720))::text || ' hours')::interval
from generated g
join incident_type_pool it
  on it.seq = g.incident_type_seq;