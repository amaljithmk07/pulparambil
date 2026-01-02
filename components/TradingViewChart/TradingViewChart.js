'use client';

import { useEffect, useRef } from 'react';
import styles from './TradingViewChart.module.scss';

export default function TradingViewChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (chartRef.current.innerHTML !== '') return;

    const script = document.createElement('script');
    script.src = 'https://d33t3vvu2t2yu5.cloudfront.net/tv.js';
    script.async = true;

    script.onload = () => {
      new window.TradingView.widget({
        container_id: 'gold_tv_chart',

        // 🔑 Main symbol (Gold)
        symbol: 'OANDA:XAUUSD',

        // 🔑 Add Silver as comparison
        compareSymbols: [
          {
            symbol: 'OANDA:XAGUSD',
            position: 'SameScale', // same price scale
          },
        ],

        interval: '1', // live 1-minute
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        autosize: true,

        hide_top_toolbar: true,
        hide_side_toolbar: true,
        allow_symbol_change: false,
        save_image: false,
        hideideas: true,
        withdateranges: false,
        details: false,
        calendar: false,
        overrides: {
          "paneProperties.background": "#0b0f19",
          "paneProperties.gridProperties.color": "#1f2937",
          "scalesProperties.textColor": "#9ca3af",
        },
      });
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div id="gold_tv_chart" ref={chartRef} className={styles.chart} />
    </div>
  );
}
