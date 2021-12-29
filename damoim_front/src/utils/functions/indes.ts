export const getSortTypeEN = (sortType: string) => {
    let sortTypeEN: string = "createdAt";
    switch (sortType) {
        case "최신순":
            sortTypeEN = "createdAt"
            break;
        case "조회순":
            sortTypeEN = "views"
            break;
        case "추천순":
            sortTypeEN = "loves"
            break;
        default :
            break;
    }
    return sortTypeEN;
}
