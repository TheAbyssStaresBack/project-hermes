create or replace view public.incidents_with_coords as
select
  id,
  location_description,
  severity,
  status,
  ST_X(location::geometry) as longitude,
  ST_Y(location::geometry) as latitude
from public.incidents
where location is not null;

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
  id,
  ST_GeogFromText('POINT(122.2276 10.6442)'),
  'Miag-ao Plaza',
  'high',
  'Mock incident for Miag-ao Plaza.',
  'new',
  now()
from public.incident_types
where name = 'Flood'
limit 1;

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
  id,
  ST_GeogFromText('POINT(122.2298 10.6389)'),
  'Sapa, Miag-ao',
  'critical',
  'Mock incident for Sapa Miag-ao.',
  'new',
  now()
from public.incident_types
where name = 'Flood'
limit 1;

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
  id,
  ST_GeogFromText('POINT(122.2289 10.6406)'),
  'UPV Gym, Miag-ao',
  'critical',
  'Mock incident for UPV Gym.',
  'new',
  now()
from public.incident_types
where name = 'Medical Emergency'
limit 1;
