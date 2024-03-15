import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firsbase"
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Input, Switcher, Title, Wrapper, Error, Form } from "../compoments/auth.components";
import GithubButton from "./github-btn";


export default function Create_Account() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || name === "" || email === "" || password === "") return;
        try {
            setLoading(true);
            const credentials = await createUserWithEmailAndPassword(
                auth, email, password
            ) //createUserWithEmailAndPassword function will return the credential value
            await updateProfile(credentials.user, { displayName: name });
            navigate("/"); //sent back to the homepage
        } catch (e) { // createUserWithEmailAndPassword captures the error
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
        } setLoading(false);
    }


    return <Wrapper>
        <Title>JOIN 𝕏</Title>
        <Form onSubmit={onSubmit}>
            <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required />
            <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required />
            <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required />
            <Input type="submit" value={isLoading ? "isLoading..." : "Create Account"} />
        </Form>
        {error != "" ? <Error>{error}</Error> : null}
        <Switcher>
            Already have an account? <Link to="/login">Log in &rarr;</Link>
        </Switcher>
        <Switcher>
            Forgot password? <Link to="/password-reset">Reset password&rarr;</Link>
        </Switcher>
        <GithubButton />
    </Wrapper>
}