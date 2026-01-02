"use client";

import React, { useState, useEffect } from "react";
import styles from "./MainScreen.module.scss";
import Image from "next/image";
import io from "socket.io-client";
import { fetchSpotRates, fetchServerURL, fetchNews } from "@/api/api";
import TradingViewChart from "../TradingViewChart/TradingViewChart";

const MainScreen = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [serverURL, setServerURL] = useState("");
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [news, setNews] = useState([]);

  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeForTimezone = (timezone) => {
    return new Date(
      currentTime.toLocaleString("en-US", { timeZone: timezone })
    );
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    return {
      hours: hours % 12 || 12,
      minutes: minutes.toString().padStart(2, "0"),
      period,
    };
  };

  const uaeTime = formatTime(getTimeForTimezone("Asia/Dubai"));
  const indiaTime = formatTime(getTimeForTimezone("Asia/Kolkata"));
  const londonTime = formatTime(getTimeForTimezone("Europe/London"));

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [spotRatesRes, serverURLRes, newsRes] = await Promise.all([
          fetchSpotRates(adminId),
          fetchServerURL(),
          fetchNews(adminId),
        ]);

        setCommodities(spotRatesRes.data.info.commodities);
        setServerURL(serverURLRes.data.info.serverURL);
        // setNews(newsRes.data.news.news);
        console.log("spotRatesRes", adminId);
      } catch (error) {
        console.error("Failed to load initial data", error);
      }
    };

    fetchInitialData();
  }, [adminId]);

  useEffect(() => {
    if (!serverURL) return;

    const socket = io(serverURL, {
      query: {
        secret: process.env.NEXT_PUBLIC_SOCKET_SECRET_KEY,
      },
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("request-data", ["GOLD", "SILVER"]);
    });

    socket.on("market-data", (data) => {
      setMarketData((prev) => ({
        ...prev,
        [data.symbol]: data,
      }));
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => socket.disconnect();
  }, [serverURL]);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className={styles.mainscreen_Section}>
      <div className={`${styles.main_lines}`}>
        <Image src={"/images/lines.svg"} height={100} width={300} alt="" />
      </div>

      <div className="container">
        <div className={`${styles.mainscreen_container}`}>
          <div className={`${styles.left_screen}`}>
            <ul className={`${styles.countries_section}`}>
              <li>
                <div className={`${styles.flag_icon}`}>
                  <Image
                    src={"/icons/flag-uae1.svg"}
                    height={100}
                    width={300}
                    alt=""
                  />
                </div>
                <div className={`${styles.timer_box}`}>
                  <h4>UAE</h4>
                  <div className={`${styles.timer_numbers}`}>
                    <span className={styles.timer}>{uaeTime.hours}</span>
                    <span>:</span>
                    <span className={styles.timer}>{uaeTime.minutes}</span>
                    <div>{uaeTime.period}</div>
                  </div>
                </div>
              </li>
              <li>
                <div className={`${styles.flag_icon}`}>
                  <Image
                    src={"/icons/flag-india.svg"}
                    height={100}
                    width={300}
                    alt=""
                  />
                </div>
                <div className={`${styles.timer_box}`}>
                  <h4>India</h4>
                  <div className={`${styles.timer_numbers}`}>
                    <span className={styles.timer}>{indiaTime.hours}</span>
                    <span>:</span>
                    <span className={styles.timer}>{indiaTime.minutes}</span>
                    <div>{indiaTime.period}</div>
                  </div>
                </div>
              </li>
              <li>
                <div className={`${styles.flag_icon}`}>
                  <Image
                    src={"/icons/flag-london.svg"}
                    height={100}
                    width={300}
                    alt=""
                  />
                </div>
                <div className={`${styles.timer_box}`}>
                  <h4>London</h4>
                  <div className={`${styles.timer_numbers}`}>
                    <span className={styles.timer}>{londonTime.hours}</span>
                    <span>:</span>
                    <span className={styles.timer}>{londonTime.minutes}</span>
                    <div>{londonTime.period}</div>
                  </div>
                </div>
              </li>
            </ul>

            <div className={`${styles.price_section}`}>
              <div className={`${styles.circle}`}></div>
              <div className={`${styles.price_left}`}>
                <div className={`${styles.logos}`}>
                  <Image
                    src={"/icons/gold-icon.svg"}
                    height={300}
                    width={300}
                    alt=""
                  />
                </div>
                <div className={`${styles.logos}`}>
                  <Image
                    src={"/icons/silver-icon.svg"}
                    height={300}
                    width={300}
                    alt=""
                  />
                </div>
              </div>

              <div className={`${styles.price_right}`}>
                {marketData.Gold && (
                  <ul>
                    <li>
                      <div className={`${styles.bid_box} ${styles.price_card}`}>
                        <h4>BID</h4>
                        <span>{marketData.Gold?.bid}</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.ask_box} ${styles.price_card}`}>
                        <h4>ASK</h4>
                        <span> {marketData.Gold?.offer}</span>
                      </div>
                    </li>
                    <li>
                      <div
                        className={`${styles.high_box} ${styles.price_card}`}
                      >
                        <h4>High</h4>
                        <span>{marketData.Gold?.high}</span>
                      </div>
                    </li>

                    <li>
                      <div className={`${styles.low_box} ${styles.price_card}`}>
                        <h4>Low</h4>
                        <span> {marketData.Gold?.low}</span>
                      </div>
                    </li>
                  </ul>
                )}
                {marketData.Silver && (
                  <ul>
                    <li>
                      <div className={`${styles.bid_box} ${styles.price_card}`}>
                        <h4>BID</h4>
                        <span>{marketData.Silver.bid}</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.ask_box} ${styles.price_card}`}>
                        <h4>ASK</h4>
                        <span>{marketData.Silver.offer}</span>
                      </div>
                    </li>
                    <li>
                      <div
                        className={`${styles.high_box} ${styles.price_card}`}
                      >
                        <h4>High</h4>
                        <span>{marketData.Silver.high}</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.low_box} ${styles.price_card}`}>
                        <h4>Low</h4>
                        <span>{marketData.Silver.low}</span>
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className={`${styles.right_screen}`}>
            <div className={`${styles.logo_section}`}>
              <Image src={"/icons/logo.png"} height={100} width={300} alt="" />
            </div>
            <div className={`${styles.date_sec}`}>{formattedDate}</div>

            {/* <ul className={`${styles.table_sec}`}>
              <li>
                <h5>999 TTBAR</h5>
                <span>60224</span>
              </li>
              <li>
                <h5>995 KGBAR</h5>
                <span>514241</span>
              </li>
              <li>
                <h5>9999 KGBAR</h5>
                <span>516790</span>
              </li>
              <li>
                <h5>9999 GM</h5>
                <span>516.77</span>
              </li>
            </ul> */}

            <TradingViewChart />
          </div>
        </div>
        <div className={styles.news_slider}>
          <span className={styles.label}>PULPARAMBIL NEWS</span>

          <div className={styles.marquee}>
            <span>
              Gold prices are poised for an upward trend driven by positive
              global signals. Investors are advised to adopt a 'buy on dips'
              strategy. China's central bank continues its gold buying spree,
              boosting reserves. Silver ETFs are also seeing significant
              inflows, indicating strong investor interest. The Federal
              Reserve's upcoming monetary policy decision will be a key event to
              watch.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
