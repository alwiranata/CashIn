import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MonthlySalesChart() {
  const [monthlyIncome, setMonthlyIncome] = useState<number[]>([]);
  const [monthlyExpense, setMonthlyExpense] = useState<number[]>([]);
  useEffect(() => {
    const fetchChart = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/dashboard/summary",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setMonthlyIncome(res.data.data.monthlyIncome);
      setMonthlyExpense(res.data.data.monthlyExpense);
    };

    fetchChart();
  }, []);
 



  const options: ApexOptions = {
    colors: ["#4ade80", "#f87171"], // income, expense
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],

      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString("id-ID")}`,
      },
    },
  };
  const series = [
    {
      name: "Income",
      data: monthlyIncome, // length 12
    },
    {
      name: "Expense",
      data: monthlyExpense, // length 12
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={200} />
        </div>
      </div>
    </div>
  );
}
