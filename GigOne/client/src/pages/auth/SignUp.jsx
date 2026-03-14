import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/api"; // Our new Axios tool

export default function SignUp() {
  const navigate = useNavigate();

  // Tabs role: controls which sign-in form is visible (User vs Admin).
  const [role, setRole] = useState("user");

  // Track login errors
  const [errorMsg, setErrorMsg] = useState("");

  // Form state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // clear old errors

    try {
      // Send the email and password to the backend using our new 'api' tool
      const response = await api.post("/auth/register", {
        name: userName,
        email: userEmail,
        password: userPassword,
      });

      // The backend gives us a token and user details back.
      const { token, user } = response.data;

      // Save the token into the browser's storage so api.js can find it
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Send them to the dashboard!
      navigate("/user/dashboard");
    } catch (error) {
      // Show error message if it exists
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Failed to connect to server");
      }
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    navigate("/admin/dashboard");
  };

  return (
    <div className="signin-page">
      <div className="signin-card-wrapper">
        {/* Brand */}
        <div className="signin-brand">
          <div className="signin-brand-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="signin-brand-name">Dashboard</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Join the platform today</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={setRole}>
              <TabsList>
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              {/* Simple error text if login fails */}
              {errorMsg && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "0.875rem",
                    textAlign: "center",
                    marginBottom: "1rem",
                    marginTop: "1rem",
                    padding: "0.5rem",
                    background: "rgba(255, 77, 79, 0.1)",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 77, 79, 0.2)",
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <TabsContent value="user">
                <form className="signin-tabs" onSubmit={handleUserSubmit}>
                  <div className="form-group">
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input
                      id="user-name"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      autoComplete="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="user-email">Email address</Label>
                    <Input
                      id="user-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit">Register Account</Button>

                  {/* Google Login Section styled to match App.css */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "0.5rem 0",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background: "var(--color-border)",
                      }}
                    ></div>
                    <span
                      style={{
                        padding: "0 10px",
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Or continue with
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background: "var(--color-border)",
                      }}
                    ></div>
                  </div>

                  <Button
                    type="button"
                    style={{
                      background: "transparent",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                      boxShadow: "none",
                    }}
                    onClick={() => {
                      // Redirect to the backend which then redirects to Google
                      window.location.href =
                        "http://localhost:5000/api/auth/google";
                    }}
                  >
                    <svg
                      style={{
                        marginRight: "8px",
                        width: "16px",
                        height: "16px",
                      }}
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="google"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 488 512"
                    >
                      <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                      ></path>
                    </svg>
                    Google
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form className="signin-tabs" onSubmit={handleAdminSubmit}>
                  <div
                    style={{
                      textAlign: "center",
                      color: "var(--color-text-muted)",
                      fontSize: "0.85rem",
                      padding: "1.5rem 0",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    Admin registration is restricted.
                  </div>
                  <Button
                    type="button"
                    style={{ marginTop: "1rem" }}
                    onClick={() => navigate("/signin")}
                  >
                    Return to Sign In
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="signin-footer">
              Already have an account? <Link to="/signin">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
