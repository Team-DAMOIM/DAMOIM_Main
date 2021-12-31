import React, {FC, useContext} from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
interface PrivateRouteProps extends RouteProps {
    component: React.FC<RouteProps>;
    path: string;
}
const PrivateRoute = ({ component: Component,path}: PrivateRouteProps) => {
    const  user  = useContext(AuthContext);
    return (
        <Route
            exact
            path={path}
            render={(props) =>
                user ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{ pathname: '/', state: { from: "로그인" } }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;

