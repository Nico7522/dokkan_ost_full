-- Sélectionne les données pour les active skills
SELECT * FROM (
SELECT cards.id as 'card_id', cards.name AS 'card_name', active_skill_sets.name AS 'as_name', active_skill_sets.id AS 'as_id', active_skill_sets.bgm_id FROM active_skill_sets
JOIN card_active_skills ON active_skill_sets.id = card_active_skills.active_skill_set_id
JOIN cards ON card_active_skills.card_id = cards.id WHERE bgm_id IS NOT NULL ORDER BY cards.id DESC) WHERE card_id = 1031081 GROUP BY bgm_id 


SELECT cards.id as 'card_id', cards.name AS 'card_name', active_skill_sets.name AS 'as_name', active_skill_sets.id AS 'as_id', active_skill_sets.bgm_id FROM active_skill_sets
JOIN card_active_skills ON active_skill_sets.id = card_active_skills.active_skill_set_id
JOIN cards ON card_active_skills.card_id = cards.id ORDER BY active_skill_sets.bgm_id

-- Sélection des standby skills avec les finish skills et leur bgm_id
SELECT * FROM (SELECT cards.id AS 'card_id', cards.name AS 'card_name', card_standby_skill_set_relations.standby_skill_set_id AS 'standby_skill_id', standby_skill_set_finish_skill_set_relations.finish_skill_set_id AS 'finish_skill_id', standby_skill_sets.bgm_id AS 'standby_bgm_id', finish_skill_sets.name AS 'finish_name', finish_skill_sets.bgm_id AS 'finish_skill_bgm_id'  FROM cards JOIN card_standby_skill_set_relations ON cards.id = card_standby_skill_set_relations.card_id 
JOIN standby_skill_sets ON card_standby_skill_set_relations.standby_skill_set_id = standby_skill_sets.id 
JOIN standby_skill_set_finish_skill_set_relations ON standby_skill_set_finish_skill_set_relations.standby_skill_set_id = standby_skill_sets.id
JOIN finish_skill_sets ON standby_skill_set_finish_skill_set_relations.finish_skill_set_id = finish_skill_sets.id
ORDER BY cards.id DESC)
GROUP BY finish_skill_bgm_id


SELECT * FROM (SELECT cards.id AS 'card_id', cards.name AS 'card_name', card_standby_skill_set_relations.standby_skill_set_id AS 'standby_skill_id', standby_skill_set_finish_skill_set_relations.finish_skill_set_id AS 'finish_skill_id', standby_skill_sets.bgm_id AS 'standby_bgm_id', finish_skill_sets.name AS 'finish_name', finish_skill_sets.bgm_id AS 'finish_skill_bgm_id'  FROM cards JOIN card_standby_skill_set_relations ON cards.id = card_standby_skill_set_relations.card_id JOIN standby_skill_sets ON card_standby_skill_set_relations.standby_skill_set_id = standby_skill_sets.id JOIN standby_skill_set_finish_skill_set_relations ON standby_skill_set_finish_skill_set_relations.standby_skill_set_id = standby_skill_sets.id JOIN finish_skill_sets ON standby_skill_set_finish_skill_set_relations.finish_skill_set_id = finish_skill_sets.id ORDER BY cards.id DESC)  GROUP BY finish_skill_bgm_id 


-- Sélectionne les données pour les entrées
SELECT * FROM (SELECT cards.id, passive_skill_effects.bgm_id, cards.name, cards.open_at, 
passive_skills.passive_skill_effect_id
FROM cards JOIN passive_skills
ON cards.passive_skill_set_id = passive_skills.id 
JOIN passive_skill_effects
ON passive_skills.passive_skill_effect_id = passive_skill_effects.id
AND passive_skill_effects.bgm_id 
IS NOT NULL 
ORDER BY cards.id DESC)
WHERE id = 1031081
GROUP BY passive_skill_effect_id 

SELECT rarity FROM cards WHERE id = 1020991



SELECT * FROM passive_skill_sets 
JOIN cards 
ON passive_skill_sets.id = cards.passive_skill_set_id
WHERE passive_skill_sets.name = 'Power to Never Lose' 
-- GROUP BY passive_skill_sets.itemized_description

SELECT * FROM passive_skill_sets WHERE name = 'Warrior of Earth''s Mettle' 

SELECT * FROM cards WHERE id = 1023461

SELECT * FROM cards JOIN passive_skill_sets ON cards.passive_skill_set_id = passive_skill_sets.id
AND passive_skill_sets.name = 'Warrior of Earth''s Mettle' 

-- 150 
SELECT * FROM cards WHERE grow_type = 50 AND open_at < '2038-01-01' 
ORDER BY open_at DESC 

-- 140 
SELECT * FROM cards WHERE grow_type = 41 AND open_at < '2038-01-01' 
ORDER BY open_at DESC 

-- 100 
SELECT * FROM cards WHERE grow_type = 40 AND open_at < '2038-01-01' 
ORDER BY open_at DESC 

-- 80
SELECT * FROM cards WHERE grow_type = 33 AND open_at < '2038-01-01' 
ORDER BY open_at DESC 

-- grow_type 1000 ??
SELECT * FROM cards WHERE grow_type = 1000 AND open_at < '2038-01-01' 
ORDER BY open_at DESC 


SELECT * FROM cards
JOIN leader_skill_sets ON cards.leader_skill_set_id = leader_skill_sets.id 
JOIN passive_skill_sets ON cards.passive_skill_set_id = passive_skill_sets.id
WHERE cards.id = 1007471

SELECT * FROM leader_skill_sets WHERE name = 'Unwavering Bond'
SELECT * FROM passive_skill_sets WHERE name = 'Crucial Battle'	


SELECT * FROM cards WHERE substr(open_at,0, 5) < '2038' ORDER BY open_at DESC
SELECT * FROM cards WHERE substr(open_at,0, 5) < '2038' AND (grow_type = 50 OR grow_type = 41 OR grow_type = 40 OR grow_type = 1000) ORDER BY open_at DESC

SELECT * FROM cards WHERE open_at < '2025-03-18 06:18:00'

SELECT * FROM cards WHERE id = 9521941 OR id = 9521941-10 OR id = 9521941 - 11


SELECT * FROM cards WHERE substr(open_at,0, 5) < '2038' ORDER BY open_at DESC

SELECT * FROM cards WHERE  open_at < '2038-01-01' ORDER BY open_at DESC



-- Récupère tous les perso TB
SELECT cards.id, cards.name, cards.open_at, card_awakenings.quantity FROM card_awakenings
JOIN card_awakening_routes ON card_awakenings.card_awakening_set_id = card_awakening_routes.card_awakening_set_id
JOIN cards ON card_awakening_routes.awaked_card_id = cards.id
WHERE card_awakenings.awakening_item_id = 40001

-- Récupère tous les perso TB avec Z-TUR
SELECT cards.id, cards.name, cards.open_at, card_awakenings.quantity FROM card_awakenings
JOIN card_awakening_routes ON card_awakenings.card_awakening_set_id = card_awakening_routes.card_awakening_set_id
JOIN cards ON card_awakening_routes.awaked_card_id = cards.id
WHERE card_awakenings.awakening_item_id = 500031

-- Récupère les médailles d'éveils nécéssaires à un personnage via son id 
SELECT  cards.name, card_awakenings.awakening_item_id, awakening_items.name, card_awakenings.quantity, card_awakening_routes.open_at FROM card_awakenings
JOIN card_awakening_routes ON card_awakenings.card_awakening_set_id = card_awakening_routes.card_awakening_set_id
JOIN cards ON card_awakening_routes.awaked_card_id = cards.id
JOIN awakening_items ON card_awakenings.awakening_item_id = awakening_items.id
WHERE cards.id = 1003311


-- Récupère les médailles d'éveils nécéssaires à un personnage via son id (avec group by)
SELECT  cards.name, card_awakenings.awakening_item_id, awakening_items.name, SUM(card_awakenings.quantity) AS 'total', card_awakening_routes.open_at FROM card_awakenings
JOIN card_awakening_routes ON card_awakenings.card_awakening_set_id = card_awakening_routes.card_awakening_set_id
JOIN cards ON card_awakening_routes.awaked_card_id = cards.id
JOIN awakening_items ON card_awakenings.awakening_item_id = awakening_items.id
WHERE cards.id = 1003311
GROUP BY awakening_items.name


-- Récupère le passif et d'autre info par étape d'éveil d'personnage via son id (ne récupère pas la bonne date pour les SZ-TUR)
SELECT cards.name, 
passive_skill_sets.id,
passive_skill_sets.itemized_description,
optimal_awakening_growths.step, 
optimal_awakening_growths.lv_max, 
optimal_awakening_growths.skill_lv_max,
optimal_awakening_growths.passive_skill_set_id, 
optimal_awakening_growths.leader_skill_set_id,
card_awakening_routes.open_at
FROM optimal_awakening_growths
JOIN cards ON optimal_awakening_growths.optimal_awakening_grow_type = cards.optimal_awakening_grow_type
JOIN card_awakening_routes ON cards.id = card_awakening_routes.awaked_card_id
JOIN passive_skill_sets ON passive_skill_sets.id = optimal_awakening_growths.passive_skill_set_id
WHERE card_awakening_routes.awaked_card_id = 1003311 AND card_awakening_routes.type IS NOT 'CardAwakeningRoute::Dokkan'
GROUP BY optimal_awakening_growths.step


SELECT * FROM optimal_awakening_growths
JOIN cards ON optimal_awakening_growths.optimal_awakening_grow_type = cards.grow_type
JOIN card_awakening_routes ON cards.id = card_awakening_routes.awaked_card_id
WHERE optimal_awakening_growths.lv_max = 140 AND card_awakening_routes.type IS 'CardAwakeningRoute::Optimal'
AND substr(card_awakening_routes.open_at,0, 5) < '2038'
ORDER BY card_awakening_routes.open_at DESC






