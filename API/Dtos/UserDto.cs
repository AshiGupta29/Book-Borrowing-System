namespace API.Dtos
{
    public class UserDto
    {
        public int Id {get; set;}
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public int TokensAvailable {get; set;}
        public string Token { get; set; }
    }
}