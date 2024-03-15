import { Navigate } from "react-router-dom";
import { auth } from "../firsbase";

export default function ProtectedRoute({ children, }: { children: React.ReactNode; }) {

    const user = auth.currentUser; //if there is no user, then null
    if (user === null) {
        return <Navigate to="/login" />
    }


    return children;
}