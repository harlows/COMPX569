insert into articles (author_id, title, content) values
        (7, 'Is Learning CSS a Waste of Time in 2026?',
    'With modern frameworks, component libraries, and utility-first CSS, it’s a fair question.'
    ); 
delete from articles where id=10

delete from users where username='sharlow'

select u.name as author, a.title as title, a.content as content from articles as a, users as u where a.author_id = u.id order by created_at