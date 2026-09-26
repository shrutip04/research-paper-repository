import Aurora from "../reactbits/Aurora/Aurora";
import ShinyText from "../reactbits/ShinyText/ShinyText";

// Shared shell for Login/Register: an Aurora background behind a glass
// card, with the ResearchSphere wordmark rendered as shimmering text.
function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="auth-page">
            <div className="auth-aurora">
                <Aurora
                    colorStops={["#172033", "#3a5a8c", "#172033"]}
                    amplitude={0.6}
                    blend={0.55}
                    speed={0.7}
                />
            </div>

            <div className="auth-card">
                <div className="auth-brand">
                    <ShinyText
                        text="ResearchSphere"
                        speed={3}
                        color="#8a93a8"
                        shineColor="#ffffff"
                    />
                </div>

                <h1>{title}</h1>

                {subtitle && <p className="auth-subtitle">{subtitle}</p>}

                {children}
            </div>
        </div>
    );
}

export default AuthLayout;
