import Grid from "@mui/material/Grid";
import { Divider, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useState, useEffect } from "react";

import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

export default function MainContent() {
  // 12H
  const to12Hour = (timeStr) => {
    const m = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!m) return timeStr;
    let hour = parseInt(m[1], 10);
    const minute = m[2];
    const isPM = hour >= 12;
    const hh = hour % 12 || 12;
    const suffix = isPM ? "م" : "ص";
    return `${hh}:${minute} ${suffix}`;
  };
  // TIMER

  // STATES
  const [nextPrayerIndex,setNextPrayerIndex] = useState(2)
  const [timings, setTimings] = useState({
    Fajr: "04:44",
    Dhuhr: "11:39",
    Asr: "14:43",
    Maghrib: "17:05",
    Isha: "18:24",
  });

  const [remainingTime,setRemainingTime] = useState("")
  const [selectedCity, setSelectedCity] = useState({
    displayName: "القاهرة",
    apiName: "Cairo",
  });
  const [today, setTodday] = useState("");
  const avilableCities = [
    {
      displayName: "القاهرة",
      apiName: "Cairo",
    },
    {
      displayName: "الجيزة",
      apiName: "Giza",
    },
    {
      displayName: "الإسكندرية",
      apiName: "Alexandria",
    },
    {
      displayName: "أسوان",
      apiName: "Aswan",
    },
    {
      displayName: "أسيوط",
      apiName: "Assiut",
    },
    {
      displayName: "البحر الاحمر",
      apiName: "Red Sea",
    },
    {
      displayName: "البحيرة",
      apiName: "Beheira",
    },
    {
      displayName: "بني سويف",
      apiName: "Beni Suef",
    },
    {
      displayName: "الدقهلية ",
      apiName: "Dakahlia",
    },
    {
      displayName: "دمياط",
      apiName: "Damietta",
    },
    {
      displayName: "الفيوم",
      apiName: "Faiyum",
    },
    {
      displayName: "الغربية",
      apiName: "Gharbia",
    },
    {
      displayName: "الإسماعيلية",
      apiName: "Ismailia",
    },
    {
      displayName: "كفر الشيخ",
      apiName: "Kafr El Sheikh",
    },
    {
      displayName: "الأقصر",
      apiName: "Luxor",
    },
    {
      displayName: "مطروح",
      apiName: "Matrouh",
    },
    {
      displayName: "المنيا",
      apiName: "Minya",
    },
    {
      displayName: "المنوفية",
      apiName: "Monufia",
    },
    {
      displayName: "شمال سيناء",
      apiName: "North Sinai",
    },
    {
      displayName: "الوادي الجديد",
      apiName: "New Valley",
    },
    {
      displayName: "بورسعيد",
      apiName: "Port Said",
    },
    {
      displayName: "القليوبية",
      apiName: "Qalyubia",
    },
    {
      displayName: "قنا",
      apiName: "Qena",
    },
    {
      displayName: "الشرقية",
      apiName: "Sharqia",
    },
    {
      displayName: "سوهاج",
      apiName: "Sohag",
    },
    {
      displayName: "جنوب سيناء",
      apiName: "South Sinai",
    },
    {
      displayName: "السويس",
      apiName: "Suez",
    },
  ];
  const prayersArray = [
    {key:"Fajr",displayName:"الفجر"},
    {key:"Dhuhr",displayName:"الظهر"},
    {key:"Asr",displayName:"العصر"},
    {key:"Maghrib",displayName:"المغرب"},
    {key:"Isha",displayName:"العشاء"}


  ]
  const getTimings = async () => {
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity.apiName}&method=5`
      );
      const raw = response.data.data.timings;
      const converted = Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [k, to12Hour(v)])
      );
      setTimings(converted);
    } catch (err) {
      console.error("Error fetching timings:", err);
    }
  };
  // useEffect
  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  useEffect(() => {
    const t = moment();
    setTodday(t.format("MMMM Do YYYY, h:mm"));

    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  // Next Pray
  const setupCountdownTimer = () => {
    const momentNow = moment();
    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex =1
    }else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex =2
    }else if  (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex =3
    }else if  (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex =4
    }else {
      prayerIndex =0
    }
    setNextPrayerIndex(prayerIndex)

    //now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer’s time
    const nextPrayerObject = prayersArray[prayerIndex]
    const nextPrayerTime = timings[nextPrayerObject.key]
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm")

    let remaningTime =  moment(nextPrayerTime,"hh:mm").diff(momentNow)

    if(remaningTime < 0){
      const midnightDiff = moment("23:59:59","hh:mm:ss").diff(momentNow)
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment("00:00:00","hh:mm:ss"))
      const totalDiffernce = midnightDiff +fajrToMidnightDiff
      remaningTime = totalDiffernce
    }

    

    const durationRemainingTime = moment.duration(remaningTime)
   setRemainingTime(
  `${durationRemainingTime.hours()}:${String(durationRemainingTime.minutes()).padStart(2, '0')}:${String(durationRemainingTime.seconds()).padStart(2, '0')}`
);

  };
  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName === event.target.value;
    });
    console.log("the new value ", event.target.value);
    setSelectedCity(cityObject);
  };
  return (
    <div>
      {/* ===== LOGO (Top Center) ===== */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <img
          src="/public/photo/Mawaqit.png"
          alt="Logo"
          style={{
            width: "420px",
            height: "auto",
            maxWidth: "90vw",
          }}
        />
      </div>
      {/* ===== END LOGO ===== */}

      {/* ===== TOP ROW ===== */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: 4,
          px: 2,
          textAlign: { xs: "center", md: "start" },
        }}
      >
        {/* Date and City*/}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ color: "#666", fontSize: "1rem" }}>
            {today}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              lineHeight: 1.2,
            }}
          >
            {selectedCity.displayName}
          </Typography>
        </Grid>

        {/*Remaining Time*/}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#666666ff", fontSize: "1rem", mb: 1 }}
          >
            متبقي حتى صلاة <div style={{color:"#15044eff",fontSize:"clamp(1.5rem, 2vw, 2rem)",fontWeight: "700"}}>{prayersArray[nextPrayerIndex].displayName}</div>
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "teal",
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            {remainingTime}
          </Typography>
        </Grid>
      </Grid>
      {/* ===== END TOP ROW ===== */}

      <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mb: 4 }} />

      {/* ===== PRAYERS CARDS ===== */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-around"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Prayer name="الفجر" time={timings.Fajr} image="/public/photo/6.jpg" />
        <Prayer name="الظهر" time={timings.Dhuhr} image="/public/photo/4.jpg" />
        <Prayer name="العصر" time={timings.Asr} image="/public/photo/5.jpg" />
        <Prayer
          name="المغرب"
          time={timings.Maghrib}
          image="/public/photo/1.jpg"
        />
        <Prayer name="العشاء" time={timings.Isha} image="/public/photo/3.jpg" />
      </Stack>
      {/* ===== END PRAYERS CARDS ===== */}
      {/* SELECT CITY */}
      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "#00213bff" }}>المدينة</span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCity.apiName || ""}
            label="المدينة"
            onChange={handleCityChange}
          >
            {avilableCities.map((city) => {
              return (
                <MenuItem value={city.apiName} key={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      {/* ==== END SELECT CITY ===*/}
    </div>
  );
}
