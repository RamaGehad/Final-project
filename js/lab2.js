// Simulated browser - it does not leave our website
const fakeBrowser = {
    currentPage: "/login",

    navigate(destination) {
        this.currentPage = destination;
        return `Simulated navigation to: ${this.currentPage}`;
    }
};
// Vulnerable login redirect
function vulnerableRedirect(next) {
    const loginSuccessful = true;
    const defaultPage = "/dashboard";

    if (!loginSuccessful) {
        return "Login failed";
    }

    const redirectUrl = next || defaultPage;
    return fakeBrowser.navigate(redirectUrl);

}
// Fixed redirect - validates the destination
function fixedRedirect(next) {
    const defaultPage = "/dashboard";
    const destination = next || defaultPage;

    if (
        typeof destination !== "string" ||
        !destination.startsWith("/") ||
        destination.startsWith("//") ||
        destination.includes("\\")
    ) {
        return "Blocked: Invalid redirect destination!";
    }

    const target = new URL(destination, "https://ghurir.example");

    if (target.origin !== "https://ghurir.example") {
        return "Blocked: External redirect!";
    }

    return fakeBrowser.navigate(
        target.pathname + target.search + target.hash
    );
}
