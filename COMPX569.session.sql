insert into articles (author_id, title, content) values
        (7, 'Is Learning CSS a Waste of Time in 2026?',
    'With modern frameworks, component libraries, and utility-first CSS, it’s a fair question.'
    ); 
delete from comments where id=3

delete from users where username='sharlow'

select u.name as author, a.title as title, a.content as content from articles as a, users as u where a.author_id = u.id order by created_at

select c.comment as comment, c.created_at as date, u.username as username from users as u, comments as c where u.id = c.user_id and c.article_id = 9 order by c.created_at asc

select count(*) as like_count from likes where article_id = 9
