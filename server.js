const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'movie_db'
    },
    console.log(`Connected to the movie_db database.`)
);

app.get('/api/movies', (req, res) => {
    db.query('SELECT * FROM movies', function (err, results) {
        console.log(results, typeof results);
        res.send(results);
    });
})

app.get('/api/movie-reviews', (req, res) => {
    db.query('SELECT movies.id, movie_name, review FROM movies JOIN reviews ON movies.id = reviews.movie_id', function (err, results) {
        console.log(results, typeof results);
        res.send(results);
    });
})

app.post('/api/add-movie', (req, res) => {
    const { movieName } = req.body;

    db.query('INSERT INTO movies (movie_name) VALUES (?)', [movieName], function (err, result) {
        if (err) {
            return res.json({ error: err })
        } else {
            console.log(result, typeof result);
            res.send("Movie was successfully added!");
        }
    });
})

app.delete('/api/movies/:id', (req, res) => {
    const id = req.params;

    db.query('DELETE FROM movies WHERE ?', [id], function (err, result) {
        if (err) {
            return res.json({ error: err })
        } else {
            console.log(result, typeof result);
            return res.send("Movie was successfully deleted!");
        }
    });
});

app.put('/api/review/:id', (req, res) => {
    const id = req.params;
    const { newReview } = req.body;

    db.query('UPDATE reviews SET review = ? WHERE ?', [newReview, id], function (err, result) {
        if (err) {
            return res.json({ error: err })
        } else {
            console.log(result, typeof result);
            return res.send("Movie was successfully updated!");
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
