namespace API.Dtos
{
    public class BookToReturnDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        
        public decimal Rating { get; set; }
       
        public string Author { get; set; }
        
        public string Genre { get; set; }
        
        public bool IsBookAvailable { get; set; }
        
        public string Description { get; set;} 
        
        public string LentByUser { get; set; }
        public int LentByUserId { get; set; }
        public string? CurrentlyBorrowedByUser { get; set; }

    }
}