import { SimpleAdapter } from "../../adapters/types";
import fetchURL from "../../utils/fetchURL";
import { CHAIN } from "../../helpers/chains";

interface IAevoVolumeResponse {
  daily_volume: string;
  total_volume: string;
}

// endTime is in nanoseconds
export const aevoVolumeEndpoint = (endTime: number) => {
  return "https://api.aevo.xyz/statistics?instrument_type=PERPETUAL&end_time=" + endTime;
}

const adapter: SimpleAdapter = {
  adapter: {
    [CHAIN.ETHEREUM]: {
      fetch: fetchAevoVolumeData,
      start: async () => 1681430400
    },
  },
};

export async function fetchAevoVolumeData(
  /** Timestamp representing the end of the 24 hour period */
  timestamp: number
) {
  const timestampInNanoSeconds = timestamp * 1e9
  const aevoVolumeData = await getAevoVolumeData(aevoVolumeEndpoint(timestampInNanoSeconds));

  const dailyVolume = Number(aevoVolumeData.daily_volume).toFixed(2);
  const totalVolume = Number(aevoVolumeData.total_volume).toFixed(2);

  return {
    timestamp,
    dailyVolume,
    totalVolume,
  };
}

async function getAevoVolumeData(endpoint: string): Promise<IAevoVolumeResponse> {
  return (await fetchURL(endpoint))?.data;
}

export default adapter;
