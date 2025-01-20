export default interface ErrorResponse {
    errors?: { [key: string]: string[] }; // Assuming `errors` is an object with string keys and array of strings as values.
    id?: string; // Include other fields like `id` if they exist.
    [key: string]: unknown; // Optional for additional fields you might not explicitly define.
}
