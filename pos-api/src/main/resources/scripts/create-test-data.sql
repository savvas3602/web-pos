insert into brands (name, description)
values (/* id: 1 */ 'Optimum Nutrition', 'Description for Optimum Nutrition'),
    (/* id: 2 */ 'Dymatize', 'Description for Dymatize'),
    (/* id: 3 */ 'MuscleTech', 'Description for MuscleTech'),
    (/* id: 4 */ 'BSN', 'Description for BSN'),
    (/* id: 5 */ 'Cellucor', 'Description for Cellucor'),
    (/* id: 6 */ 'Universal Nutrition', 'Description for Universal Nutrition'),
    (/* id: 7 */ 'Gaspari Nutrition', 'Description for Gaspari Nutrition'),
    (/* id: 8 */ 'Muscletech', 'Description for Muscletech'),
    (/* id: 9 */ 'GNC', 'Description for GNC');

insert into product_types (name, description)
values (/* id: 1 */ 'Whey Protein', 'Description for Whey Protein'),
    (/* id: 2 */ 'Casein Protein', 'Description for Casein Protein'),
    (/* id: 3 */ 'Plant-Based Protein', 'Description for Plant-Based Protein'),
    (/* id: 4 */ 'Pre-Workout', 'Description for Pre-Workout'),
    (/* id: 5 */ 'Post-Workout', 'Description for Post-Workout'),
    (/* id: 6 */ 'Vitamins & Supplements', 'Description for Vitamins & Supplements'),
    (/* id: 7 */ 'Weight Gainers', 'Description for Weight Gainers'),
    (/* id: 8 */ 'Amino Acids', 'Description for Amino Acids'),
    (/* id: 9 */ 'Creatine', 'Description for Creatine'),
    (/* id: 10 */ 'BCAAs', 'Description for BCAAs');

insert into products (name, description, retail_price, wholesale_price, product_type_id, stock_quantity)
values (/* id: 1 */ 'Optimum Nutrition Gold Standard 100% Whey', 'Description for Optimum Nutrition Gold Standard 100% Whey', 29.99, 19.99, 1, 1000),
       (/* id: 2 */ 'Dymatize ISO100', 'Description for Dymatize ISO100', 34.99, 24.99, 1, 1000),
       (/* id: 3 */ 'MuscleTech NitroTech', 'Description for MuscleTech NitroTech', 39.99, 29.99, 1, 1000),
       (/* id: 4 */ 'BSN Syntha-6', 'Description for BSN Syntha-6', 27.99, 17.99, 1, 1000),
       (/* id: 5 */ 'Cellucor Cor-Performance Whey', 'Description for Cellucor Cor-Performance Whey', 31.99, 21.99, 1, 1000),
       (/* id: 6 */ 'Universal Nutrition Animal Whey', 'Description for Universal Nutrition Animal Whey', 28.99, 18.99, 1, 1000);

insert into payment_methods (name, description)
values (/* id: 1 */ 'Cash', 'Cash payments'),
       (/* id: 2 */ 'Visa', 'Visa card payments'),
       (/* id: 3 */ 'Revolut', 'Direct revolut transfers'),
       (/* id: 4 */ 'Other', 'Other types of payment methods');

drop table if exists rpt_purchase_history;
create view rpt_purchase_history as
select o.id,
       o.created_at,
       o.order_value,
       o.comments,
       pm.name as payment_method,
       o.total_overridden,
       sum(op.quantity) as total_items,
       string_agg(
               p.name || ' x' || op.quantity, ', ' order by p.name
       ) as items
from orders o
         join payment_methods pm on pm.id = o.payment_method_id
         join orders_products op on op.order_id = o.id
         join products p on p.id = op.product_id
group by
    o.id,
    o.created_at,
    o.order_value,
    o.comments,
    pm.name,
    o.total_overridden
order by o.created_at desc;
