import { useEffect, useState } from "react";
import { Grid, GridColumn, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

function ActivityDahsboard() {

    const { activityStore } = useStore();
    const { loadActivities, activityRegistery, setPagingParams, pagination } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {        
        if (activityRegistery.size <= 1) loadActivities();
    }, [loadActivities, activityRegistery.size]);

    return (
        <Grid>
            <Grid.Column width={'10'}>
                {activityStore.loadingInitial && activityRegistery.size === 0 && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}>
                        <ActivityList />
                    </InfiniteScroll>
                )}

            </Grid.Column>
            <GridColumn width={'6'}>
                <ActivityFilters />
            </GridColumn>
            <GridColumn width={10}>
                <Loader active={loadingNext} />
            </GridColumn>
        </Grid>
    )
}

export default observer(ActivityDahsboard);