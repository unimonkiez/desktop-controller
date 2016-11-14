export default res => (res.status === 200 ? Promise.resolve() : Promise.reject());
