insert into users (username, password, full_name, email)
values ('admin',
        '$2a$12$n1gQJPqHOV7MR.H2M2rFHeNaijkP7ui7vx5iMhd3wlgRTgPg/rh1O',
        'Admin User',
        'admin@k2-test.com',
       );

insert into payment_methods (name, description)
values (/* id: 1 */ 'Cash', 'Cash payments'),
       (/* id: 2 */ 'Visa', 'Visa card payments'),
       (/* id: 3 */ 'Revolut', 'Direct revolut transfers'),
       (/* id: 4 */ 'Other', 'Other types of payment methods');


insert into brands (name, description)
values (/* id: 1 */ 'ASL', ''),
    (/* id: 2 */ 'ActiveLab', ''),
    (/* id: 3 */ 'BioLab', ''),
    (/* id: 4 */ 'Nano', ''),
    (/* id: 5 */ 'IronFlex', ''),
    (/* id: 6 */ 'Mutant', ''),
    (/* id: 7 */ 'AppliedNutrition', ''),
    (/* id: 8 */ 'Optimum Nutrition', ''),
    (/* id: 9 */ 'MyProtein', ''),
    (/* id: 10 */ 'HIROLab', ''),
    (/* id: 11 */ 'Realpharm', ''),
    (/* id: 12 */ 'USN', ''),
    (/* id: 13 */ 'Gaspari Nutrition', '');


insert into product_types (name, description)
values (/* id: 1 */ 'Whey Protein', ''),
    (/* id: 2 */ 'Isolate Whey', ''),
    (/* id: 3 */ 'Creatine Monohydrate', ''),
    (/* id: 4 */ 'Gainer Protein', ''),
    (/* id: 5 */ 'Vegan Protein', ''),
    (/* id: 6 */ 'Pre-Workout', ''),
    (/* id: 7 */ 'Post-Workout', ''),
    (/* id: 8 */ 'Amino Acids', ''),
    (/* id: 9 */ 'Multi-vitamin pills', ''),
    (/* id: 10 */ 'Fat-Burners', ''),
    (/* id: 11 */ 'Magnesium', ''),
    (/* id: 12 */ 'Collagen', ''),
    (/* id: 13 */ 'Omega 3', ''),
    (/* id: 14 */ 'Liver-Support', ''),
    (/* id: 15 */ 'D3', ''),
    (/* id: 16 */ 'ATP', ''),
    (/* id: 17 */ 'Berberine', ''),
    (/* id: 18 */ 'Ashwaganda', ''),
    (/* id: 19 */ 'Electrolytes', ''),
    (/* id: 20 */ 'Testosterone', ''),
    (/* id: 21 */ 'D3', ''),
    (/* id: 22 */ 'Gels', ''),
    (/* id: 23 */ 'Carbohydrates', ''),
    (/* id: 24 */ 'Protein Bar', ''),


insert into products (name, description, retail_price, wholesale_price, product_type_id, stock_quantity)
values
    (/* id: 1 */
        'ASL Beast Pro Whey 2kg',
        '24g protein. Least processed whey, sugar free, contains sucralose for sweetness and lactose',
        50.00, 0, 1, 2000
    ),
    (/* id: 2 */
        'ASL Beast Pro Whey 900g',
        'Least processed whey, sugar free, contains sucralose for sweetness and lactose',
        25.00, 0, 1, 2000
    ),
    (/* id: 3 */
        'ASL Isolate Whey 2kg',
        '26g protein per scoop. Highly processed whey, hydrolyzed - quickest absorption, sugar free, ' ||
        'contains sucralose for sweetness no lactose',
        60.00, 0, 2, 2000
    ),
    (/* id: 4 */
        'ASL Isolate Whey 900g',
        '26g protein per scoop. Highly processed whey, hydrolyzed - quickest absorption, sugar free, ' ||
        'contains sucralose for sweetness no lactose',
        35.00, 0, 2, 2000
    ),
    (/* id: 5 */
        'MusclePower Creatine Monohydrate 500g',
        '',
        25.00, 0, 3, 2000
    );


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
