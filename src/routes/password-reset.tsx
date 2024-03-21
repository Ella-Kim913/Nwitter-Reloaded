import { useState } from "react";
import { auth } from "../firsbase"
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { EmailAuthCredential, EmailAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { Input, Title, Wrapper, Error, Form } from "../compoments/auth.components";


export default function PasswordReset() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "email") {
            setEmail(value);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || email === "") return;
        try {
            setLoading(true);
            email
            await sendPasswordResetEmail(auth, email);
            navigate("/login");
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    }


    return <Wrapper>
        <Title>Reset Password 𝕏</Title>
        <Form onSubmit={onSubmit}>
            <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required />
            <Input type="submit" value={isLoading ? "isLoading..." : "Send reset mail"} />
        </Form>
        {error != "" ? <Error>{error}</Error> : null}
    </Wrapper>
}