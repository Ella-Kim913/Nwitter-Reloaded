import { auth } from "../firsbase";

export default function Home() {
    const logOut = () => {
        auth.signOut();
    }
    return (
        <h1>
            <button onClick={logOut}></button>
        </h1>
    );
}