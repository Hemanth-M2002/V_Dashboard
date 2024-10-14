import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";
import { Globe, TrendingUp, Lightbulb, AlertTriangle, Newspaper } from "lucide-react";

const COLORS = [
    "#FF6384", // Red
    "#36A2EB", // Blue
    "#FFCE56", // Yellow
    "#4BC0C0", // Teal
    "#9966FF", // Purple
    "#FF9F40", // Orange
    "#FF5757", // Light Red
    "#57C7B9", // Light Teal
    "#F9C74F", // Light Yellow
    "#2A9D8F", // Dark Teal
    "#E9C46A", // Olive
    "#F6BD60", // Beige
    "#E76F51", // Salmon
    "#8ABF9E", // Soft Green
    "#F94144", // Bright Red
    "#F3722C", // Bright Orange
    "#F8961E", // Bright Yellow
    "#F9C74F", // Light Olive
    "#90BE6D", // Bright Green
    "#577590", // Slate Blue
    "#2C6E49", // Dark Green
    "#F3722C", // Coral
    "#A1C6EA", // Soft Blue
    "#D9BF77", // Wheat
];

export default function Dashboard() {
    const [insightData, setInsightData] = useState([]);
    const [regionData, setRegionData] = useState([]); // Placeholder for regional data
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedSector, setSelectedSector] = useState("All");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/data'); // Ensure this matches your backend endpoint
                const data = await response.json();
                setInsightData(data);

                // Calculate or fetch regional data based on your data structure
                // Example calculation for regional distribution based on 'region' field
                const regionCounts = data.reduce((acc, item) => {
                    acc[item.region] = (acc[item.region] || 0) + 1;
                    return acc;
                }, {});

                const formattedRegionData = Object.keys(regionCounts).map(region => ({
                    name: region,
                    value: regionCounts[region],
                }));

                setRegionData(formattedRegionData);
            } catch (error) {
                console.error("Error fetching insights:", error);
            }
        };

        fetchData();
    }, []);

    // Function to aggregate data for bar chart
    const aggregateDataForBarChart = (data) => {
        const aggregatedData = data.reduce((acc, item) => {
            const sector = item.sector;
            if (!acc[sector]) {
                acc[sector] = { sector, intensity: 0, likelihood: 0, relevance: 0, count: 0 };
            }
            acc[sector].intensity += item.intensity;
            acc[sector].likelihood += item.likelihood;
            acc[sector].relevance += item.relevance;
            acc[sector].count += 1;
            return acc;
        }, {});

        // Convert to an array and average the values
        return Object.values(aggregatedData).map(item => ({
            sector: item.sector,
            intensity: (item.intensity / item.count).toFixed(2),
            likelihood: (item.likelihood / item.count).toFixed(2),
            relevance: (item.relevance / item.count).toFixed(2),
        }));
    };

    const filteredInsightData = aggregateDataForBarChart(selectedSector === "All"
        ? insightData
        : insightData.filter(item => item.sector === selectedSector));

    const Data = selectedSector === "All"
        ? insightData
        : insightData.filter(item => item.sector === selectedSector);

    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#f7fafc" }}>
            {/* Sidebar */}
            <aside style={{ width: "250px", backgroundColor: "#fff", borderRight: "1px solid #e2e8f0" }}>
                <div style={{ padding: "1rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600" }}>Global Insights</h2>
                </div>
                <nav style={{ marginTop: "1rem" }}>
                    <button
                        style={{ width: "100%", padding: "0.5rem", backgroundColor: activeTab === "overview" ? "#edf2f7" : "transparent" }}
                        onClick={() => setActiveTab("overview")}
                    >
                        <Globe style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                        Overview
                    </button>
                    <button
                        style={{ width: "100%", padding: "0.5rem", backgroundColor: activeTab === "trends" ? "#edf2f7" : "transparent" }}
                        onClick={() => setActiveTab("trends")}
                    >
                        <TrendingUp style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                        Trends Analysis
                    </button>
                </nav>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "600" }}>Global Insights Dashboard</h1>
                    <select value={selectedSector} onChange={e => setSelectedSector(e.target.value)} style={{ padding: "0.5rem" }}>
                        <option value="All">All Sectors</option>
                        {Array.from(new Set(insightData.map(item => item.sector))).map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                        ))}
                    </select>
                </div>

                {/* Tabs content */}
                {activeTab === "overview" && (
                    <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                            {["intensity", "likelihood", "relevance", "impact"].map((key, index) => (
                                <div key={index} style={{ border: "1px solid #e2e8f0", padding: "1rem", borderRadius: "0.5rem" }}>
                                    <h3 style={{ fontSize: "1rem", fontWeight: "500" }}>
                                        {key === "intensity" && <TrendingUp style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />}
                                        {key === "likelihood" && <Lightbulb style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />}
                                        {key === "relevance" && <AlertTriangle style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />}
                                        {`Average ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                    </h3>
                                    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                                        {(Data.reduce((sum, item) => sum + item[key], 0) / Data.length).toFixed(2)}
                                    </div>
                                    <p style={{ fontSize: "0.875rem", color: "#a0aec0" }}>{key === "impact" ? "Potential effect" : `Average ${key}`}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                            <div style={{ gridColumn: "span 4", border: "1px solid #e2e8f0", padding: "1rem", borderRadius: "0.5rem" }}>
                                <h3 style={{ fontSize: "1rem", fontWeight: "500" }}>Sector Comparison</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={filteredInsightData}>
                                        <XAxis dataKey="sector" />
                                        <YAxis />

                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="intensity" fill="#8884d8" />
                                        <Bar dataKey="likelihood" fill="#82ca9d" />
                                        <Bar dataKey="relevance" fill="#ffc658" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ gridColumn: "span 4", border: "1px solid #e2e8f0", padding: "1rem", borderRadius: "0.5rem" }}>
                                <h3 style={{ fontSize: "1rem", fontWeight: "500" }}>Regional Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={regionData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                                            {regionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "trends" && (
                    <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                            <div style={{ border: "1px solid #e2e8f0", padding: "1rem", borderRadius: "0.5rem" }}>
                                <h3 style={{ fontSize: "1rem", fontWeight: "500" }}>Recent Insights</h3>
                                <div>
                                    {insightData.slice(0, 5).map((insight, index) => (
                                        <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                                            <Newspaper style={{ marginRight: "0.5rem", color: "#4a5568" }} />
                                            <div>
                                                <p style={{ fontSize: "0.875rem", fontWeight: "500" }}>{insight.title}</p>
                                                <p style={{ fontSize: "0.75rem", color: "#a0aec0" }}>{insight.added}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
