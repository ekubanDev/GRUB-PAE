// useQuery
import { useQuery } from "@apollo/client";
// queries
import { RECENT_ORDER_RESTAURANTS } from "@/lib/api/graphql";
// interfaces
import {
  IRecentOrderedRestaurantsData,
  IRestaurant,
} from "@/lib/utils/interfaces";

function useRecentOrderRestaurants(enabled = true) {
  const { loading, data, error } = useQuery<IRecentOrderedRestaurantsData>(
    RECENT_ORDER_RESTAURANTS,
    {
      variables: {
        latitude: 5.6037,   // Accra, Ghana — GRUB-PAE default market
        longitude: -0.1870,
      },
      fetchPolicy: "cache-and-network",
      skip: !enabled,
    }
  );

  const queryData: IRestaurant[] = data?.recentOrderRestaurantsPreview || [];

  return {
    queryData,
    loading,
    error,
  };
}

export default useRecentOrderRestaurants;
