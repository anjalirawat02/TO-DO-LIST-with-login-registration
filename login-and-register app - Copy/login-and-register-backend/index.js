import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB")
.then(
    console.log("DB connected")
)
.catch(err=> console.log(err.message));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes

// ...

app.post("/login", async (req, res)=> {
    const { email, password} = req.body;
    try {
        const user = await User.findOne({ email: email }).exec();
        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successful", user: user });
            } else {
                res.send({ message: "Password didn't match" });
            }
        } else {
            res.send({ message: "User not registered" });
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}); 

app.post("/register", async (req, res)=> {
    const { name, email, password} = req.body;
    try {
        const existingUser = await User.findOne({ email: email }).exec();
        if (existingUser) {
            res.send({ message: "User already registered" });
        } else {
            const user = new User({
                name,
                email,
                password
            });
            await user.save();
            res.send({ message: "Successfully Registered, Please login now." });
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}); 

// ...

app.listen(9002,() =>{
    console.log("BE started at port 9002")
})

