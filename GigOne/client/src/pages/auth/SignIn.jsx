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

export default function SignIn() {
  const navigate = useNavigate();

  // Tabs role: controls which sign-in form is visible (User vs Admin).
  const [role, setRole] = useState("user");

  // Track login errors
  const [errorMsg, setErrorMsg] = useState("");

  // Form state (controlled inputs). Keeping User/Admin separate avoids
  // mixing values when toggling between the two tabs.
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // clear old errors

    try {
      // Send the email and password to the backend using our new 'api' tool
      const response = await api.post("/auth/login", {
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
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Label htmlFor="user-password">Password</Label>
                      <Link
                        to="#"
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-primary-light)",
                          textDecoration: "none",
                        }}
                      >
                        Forgot?
                      </Link>
                    </div>
                    <Input
                      id="user-password"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit">Sign In as User</Button>

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
                  <div className="form-group">
                    <Label htmlFor="admin-email">Email address</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      name="email"
                      placeholder="admin@example.com"
                      autoComplete="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit">Sign In as Admin</Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="signin-footer">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
