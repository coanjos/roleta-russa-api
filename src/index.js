const app = require('./app')

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Sistema escutando na porta ${port}`)
})