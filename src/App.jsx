import "./App.css";
import MainContent from "./components/MainContent";
import Container from "@mui/material/Container";

function App() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100vw",
          backgroundColor: "#07141eff",
          minHeight: "100vh",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            backgroundColor: "white",
            padding: { xs: 2, sm: 3, md: 4 },
            marginTop: 4,
            marginBottom:4,
            boxShadow: 3,
            background:"#d2e2e5ff",
          }}
        >
          <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
