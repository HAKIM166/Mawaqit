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

// PHOTO
import fajrImg from '../photo/6.jpg';
import DhuhrImg from '../photo/4.jpg';
import AsrImg from '../photo/5.jpg';
import MaghribImg from '../photo/1.jpg';
import IshaImg from '../photo/3.jpg';
import MawaqitImg from '../photo/Mawaqit.png';



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
const setupCountdownTimer = (testTime = null) => {
  moment.locale("en"); 
  const momentNow = testTime || moment();
  let prayerIndex = 0;

  const normalizeTime = (timeStr) => timeStr.replace("ص", "AM").replace("م", "PM").trim();

  const fajrMoment = moment(moment().format("YYYY-MM-DD") + " " + normalizeTime(timings["Fajr"]), "YYYY-MM-DD hh:mm A");
  const dhuhrMoment = moment(moment().format("YYYY-MM-DD") + " " + normalizeTime(timings["Dhuhr"]), "YYYY-MM-DD hh:mm A");
  const asrMoment = moment(moment().format("YYYY-MM-DD") + " " + normalizeTime(timings["Asr"]), "YYYY-MM-DD hh:mm A");
  const maghribMoment = moment(moment().format("YYYY-MM-DD") + " " + normalizeTime(timings["Maghrib"]), "YYYY-MM-DD hh:mm A");
  const ishaMoment = moment(moment().format("YYYY-MM-DD") + " " + normalizeTime(timings["Isha"]), "YYYY-MM-DD hh:mm A");

  const prayersMoments = [fajrMoment, dhuhrMoment, asrMoment, maghribMoment, ishaMoment];

  for (let i = 0; i < prayersMoments.length; i++) {
    if (momentNow.isBefore(prayersMoments[i])) {
      prayerIndex = i;
      break;
    }
    if (i === prayersMoments.length - 1) {
      prayerIndex = 0;
      prayersMoments[0].add(1, "day");
    }
  }

  setNextPrayerIndex(prayerIndex);

  const nextPrayerMoment = prayersMoments[prayerIndex];
  const remainingTime = nextPrayerMoment.diff(momentNow);
  const durationRemainingTime = moment.duration(remainingTime);

  setRemainingTime(
    `${durationRemainingTime.hours()}:${String(durationRemainingTime.minutes()).padStart(2, "0")}:${String(durationRemainingTime.seconds()).padStart(2, "0")}`
  );

  // const nextPrayerObject = prayersArray[prayerIndex];
  // console.log("🕒 الوقت الحالي:", momentNow.format("hh:mm A"));
  // console.log("➡️ الصلاة القادمة:", nextPrayerObject?.displayName || "❌ غير محددة");
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
          src={MawaqitImg}
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
        <Prayer name="الفجر" time={timings.Fajr} image={fajrImg} />
        <Prayer name="الظهر" time={timings.Dhuhr} image={DhuhrImg} />
        <Prayer name="العصر" time={timings.Asr} image={AsrImg} />
        <Prayer
          name="المغرب"
          time={timings.Maghrib}
          image={MaghribImg}
        />
        <Prayer name="العشاء" time={timings.Isha} image={IshaImg}/>
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
