import { useEffect, useState } from "react";
import { Button, Card, Col, Input, Pagination, Row, Select, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { MealDto } from "../../../models/mealDto";
import { GetAllMeal } from "../../../services/meal-services";

const { Option } = Select;
const { Title } = Typography;
export interface CategoryInfo {
    categoryId: string;
    categoryName: string;
}
const MenuPage = () => {
    const [meals, setMeals] = useState<MealDto[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(9); // Setting page size to 9
    const [totalCount, setTotalCount] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterSellStatus, setFilterSellStatus] = useState('');
    const [filterMealStatus, setFilterMealStatus] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [categoryinfo, setCategoryInfo] = useState<CategoryInfo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await GetAllMeal(filterCategory, filterSellStatus, filterMealStatus, searchTerm, '0', '0', pageIndex, pageSize);
            setMeals(result.items);
            setTotalCount(result.totalCount);
        };
        fetchData();
    }, [filterCategory, filterSellStatus, filterMealStatus, searchTerm, pageIndex, pageSize]);
    useEffect(() => {
        fetch('https://restaurantmanagement.azurewebsites.net/api/category/category-info')
            .then(response => response.json())
            .then(data => setCategoryInfo(data.value))
            .catch(error => console.log(error));
    }, []);
    const handleCategoryChange = (value: string) => {
        const selectedCategory = categoryinfo.find(category => category.categoryId === value);
        setCategoryId(value);
        setCategoryName(selectedCategory ? selectedCategory.categoryName : '');
    };
    const handleFilterCategory = async (value: string) => {
        const results = await GetAllMeal(value, filterSellStatus, filterMealStatus, searchTerm, '0', '0', pageIndex, pageSize);
        setMeals(results.items);
        setFilterCategory(value);
        setPageIndex(1);
        setTotalCount(results.totalCount);
    };

    const handleFilterSellStatus = async (value: string) => {
        const results = await GetAllMeal(filterCategory, value, filterMealStatus, searchTerm, '0', '0', pageIndex, pageSize);
        setMeals(results.items);
        setFilterSellStatus(value);
        setPageIndex(1);
        setTotalCount(results.totalCount);
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const results = await GetAllMeal(filterCategory, filterSellStatus, filterMealStatus, searchTerm, '0', '0', pageIndex, pageSize);
            setMeals(results.items);
            setPageIndex(1);
            setTotalCount(results.totalCount);
        }
    };

    return (
        <div className="container">
            <Row gutter={24}>
                {/* Left Column: Filters */}
                <Col span={24} md={6}>
                    <Card title="Filter Options" style={{ marginTop: 20 }}>
                        {/* Category Filter */}
                        <Select
                            defaultValue=""
                            style={{ width: '100%', marginTop: 10 }}
                            onChange={handleFilterCategory}
                            placeholder="Select Category"
                        >
                            <Option value="">All Categories</Option>
                            {categoryinfo.map((category) => (
                                <Select.Option key={category.categoryId} value={category.categoryName}>
                                    {category.categoryName}
                                </Select.Option>
                            ))}
                        </Select>

                        {/* Search Input */}
                        <Input
                            placeholder="Search by Name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchSubmit}
                            style={{ marginTop: 20 }}
                        />
                    </Card>
                </Col>

                {/* Right Column: Meal Products */}
                <Col span={24} md={18}>
                    <Row gutter={16}>
                        {meals.length === 0 ? (
                            <Col span={24}>
                                <Card style={{ textAlign: 'center', marginTop: 20 }}>
                                    <Title level={4}>Món ăn không tồn tại</Title>
                                    <p>Hãy tìm kiếm món ăn khác. Rất nhiều món ngon đang chờ bạn thưởng thức</p>
                                </Card>
                            </Col>
                        ) : (
                            meals.map((meal) => (
                                <Col span={8} key={meal.mealId}>
                                    <Card
                                        hoverable
                                        cover={<img alt={meal.mealName} src={meal.imageUrl} />}
                                    >
                                        <Card.Meta
                                            title={meal.mealName}
                                            description={
                                                <>
                                                    <div>Category: {meal.categoryName}</div>
                                                    <div>Price: {meal.price}đ</div>
                                                    {meal.sellStatus === 'Inactive' && (
                                                        <Tag color="red">Not Available</Tag>
                                                    )}
                                                </>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>

                    <Pagination
                        current={pageIndex}
                        total={totalCount}
                        pageSize={pageSize}
                        onChange={setPageIndex}
                        showSizeChanger={false}
                        showQuickJumper={true}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default MenuPage;
