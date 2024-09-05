import express from 'express'
import passport from 'passport'
import { SenlerStrategy } from 'passport-senler'
import session from 'express-session'

passport.use(
	new SenlerStrategy({
		clientID: '66d9cba9c6e3b379e659e9a2',
		clientSecret: '4dc8088f0a264c18e764f31eadd71ab18f243d23',
		callbackURL:
			'https://9569-188-233-57-106.ngrok-free.app/auth/senler/callback',
	})
)

const app = express()

app.use(
	session({ secret: 'your_secret', resave: false, saveUninitialized: false })
)
app.use(passport.initialize())
app.use(passport.session())


app.get('/auth/senler', passport.authenticate('senler'))

app.get(
	'/auth/senler/callback',
	passport.authenticate('senler', { session: false }),
	(req, res) => {
		res.json(req.user)
	}
)

app.get(
	'/auth/senler/error',
	(req, res) => {
		res.json(req.user)
	}
)

app.listen(3000, () => {
	console.log('App is listening on port 3000')
})
