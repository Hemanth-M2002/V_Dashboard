// components/AreaChartComponent.jsx
import React, { useState, useEffect } from "react";
import { Line, Radar, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    RadialLinearScale,
    ArcElement,
    BarElement
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    RadialLinearScale,
    ArcElement,
    BarElement
);

export default function AreaChartComponent() {
    const [insightData, setInsightData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null); // Changed to null initially

    // Fetch data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/data"); // Adjust endpoint if needed
                const data = await response.json();
                setInsightData(data);
                setFilteredData(data); // Initialize with all data

                // Set a random year from the available years if data exists
                const years = Array.from(new Set(data.map(item => new Date(item.published).getFullYear())));
                if (years.length > 0) {
                    const randomYear = years[Math.floor(Math.random() * years.length)];
                    setSelectedYear(randomYear); // Set the selected year to a random year
                }
            } catch (error) {
                console.error("Error fetching insights:", error);
            }
        };

        fetchData();
    }, []);

    // Extract unique years from the data
    const years = Array.from(new Set(insightData.map(item => new Date(item.published).getFullYear())));

    // Filter data based on the selected year
    useEffect(() => {
        if (selectedYear) {
            const filtered = insightData.filter(item => new Date(item.published).getFullYear().toString() === selectedYear);
            setFilteredData(filtered);
        }
    }, [selectedYear, insightData]);

    // Prepare data for the Line Chart
    const lineChartData = {
        labels: filteredData.map(item => new Date(item.published).toLocaleDateString()), // X-axis labels
        datasets: [
            {
                label: "Intensity",
                data: filteredData.map(item => item.intensity),
                borderColor: "#8884d8",
                backgroundColor: "rgba(136, 132, 216, 0.5)",
                fill: true,
            },
            {
                label: "Likelihood",
                data: filteredData.map(item => item.likelihood || 0), // Add default value if likelihood is undefined
                borderColor: "#82ca9d",
                backgroundColor: "rgba(130, 202, 157, 0.5)",
                fill: true,
            },
            {
                label: "Relevance",
                data: filteredData.map(item => item.relevance),
                borderColor: "#ffc658",
                backgroundColor: "rgba(255, 198, 88, 0.5)",
                fill: true,
            },
        ],
    };

    // Prepare data for the Radar Chart
    const radarChartData = {
        labels: ['Intensity', 'Relevance', 'Likelihood'],
        datasets: [
            {
                label: "Insights Overview",
                data: [
                    filteredData.reduce((acc, item) => acc + item.intensity, 0) / filteredData.length || 0,
                    filteredData.reduce((acc, item) => acc + item.relevance, 0) / filteredData.length || 0,
                    filteredData.reduce((acc, item) => acc + (item.likelihood || 0), 0) / filteredData.length || 0,
                ],
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for the Vertical Bar Chart
    const barChartData = {
        labels: years,
        datasets: [
            {
                label: "Average Intensity",
                data: years.map(year => {
                    const yearlyData = insightData.filter(item => new Date(item.published).getFullYear() === parseInt(year));
                    return yearlyData.reduce((acc, item) => acc + item.intensity, 0) / yearlyData.length || 0;
                }),
                backgroundColor: "#8884d8",
            },
            {
                label: "Average Relevance",
                data: years.map(year => {
                    const yearlyData = insightData.filter(item => new Date(item.published).getFullYear() === parseInt(year));
                    return yearlyData.reduce((acc, item) => acc + item.relevance, 0) / yearlyData.length || 0;
                }),
                backgroundColor: "#ffc658",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: "Date",
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: "Value",
                },
            },
        },
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "600" }}>
                Insights - Area Chart
            </h2>

            {/* Year Selection Dropdown */}
            <div style={{ marginBottom: "1rem" }}>
                <label style={{ marginRight: "0.5rem" }}>Select Year:</label>
                <select
                    value={selectedYear || ""}
                    onChange={e => setSelectedYear(e.target.value)}
                    style={{ padding: "0.5rem" }}
                >
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* Area Chart */}
            <div style={{ marginTop: "1rem" }}>
                <Line data={lineChartData} options={chartOptions} />
            </div>

            {/* Radar Chart */}
            <h2 style={{ marginTop: "2rem", marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "600" }}>
                Insights - Radar Chart
            </h2>
            <div style={{ marginTop: "1rem" }}>
                <Radar data={radarChartData} />
            </div>

            {/* Vertical Bar Chart */}
            <h2 style={{ marginTop: "2rem", marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "600" }}>
                Insights - Vertical Bar Chart
            </h2>
            <div style={{ marginTop: "1rem" }}>
                <Bar data={barChartData} options={chartOptions} />
            </div>
        </div>
    );
}
