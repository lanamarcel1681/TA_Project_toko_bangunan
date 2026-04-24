// District-based time mapping (in minutes)
const districtWeights: Record<string, number> = {
    'jambi timur': 25,
    'pasar jambi': 20,
    'jambi selatan': 30,
    'jelutung': 40,
    'telanaipura': 45,
    'pelayangan': 50,
    'danau teluk': 55,
    'alam barajo': 70,
    'kota baru': 65,
    'danau sipin': 60,
};

export const calculateShippingEstimation = (address: string, departureTime: Date | null) => {
    const addrLower = address?.toLowerCase() || "";
    let durationMinutes = 45; // Default

    for (const [district, time] of Object.entries(districtWeights)) {
        if (addrLower.includes(district)) {
            durationMinutes = time;
            break;
        }
    }

    // If no district found, estimation based on address length as proxy for detail/distance
    if (durationMinutes === 45 && addrLower.length > 50) durationMinutes = 90;

    const durationText = durationMinutes >= 60 
        ? `${Math.floor(durationMinutes / 60)} Jam ${durationMinutes % 60} Menit`
        : `${durationMinutes} Menit`;

    let eta = "Menunggu Berangkat";
    if (departureTime) {
        const etaDate = new Date(new Date(departureTime).getTime() + durationMinutes * 60000);
        eta = etaDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
    }

    return { duration: durationText, eta };
};
