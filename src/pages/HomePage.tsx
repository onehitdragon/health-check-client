import { Flex, Typography } from "antd";

const { Title } = Typography;

export function HomePage(){
    return (
        <Flex justify="center" flex={1}>
            <Title>Welcome</Title>
        </Flex>
    );
}