import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";


export default function Prayer({name,time,image}) {
  return (
    <Card
      sx={{
        width: { xs: "90%", sm: "45%", md: "30%", lg: "16%" },
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        textAlign: "center",
        m: 2,
        bgcolor: "white",
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt="Prayer time"
        sx={{
          height: { xs: 120, sm: 140, md: 160 },
          objectFit: "cover",
        }}
      />
      <CardContent>

        <h2>
          {name}
        </h2>

        <Typography
          variant="h3"
          color="text.secondary"
          sx={{ fontWeight: "bold" }}
        >
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}
