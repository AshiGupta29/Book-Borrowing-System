using Core.Entities;

namespace Core.Specifications
{
    public class BooksWithSearchSpecification : BaseSpecification<Book>
    {
        public BooksWithSearchSpecification(BookSpecParams bookParams)
          : base(x =>
               string.IsNullOrEmpty(bookParams.Search) ||
                x.Name.ToLower().Contains(bookParams.Search) ||
                x.Author.ToLower().Contains(bookParams.Search) ||
                x.Genre.ToLower().Contains(bookParams.Search)
               ){}

        public BooksWithSearchSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.LentByUser);
            AddInclude(x => x.CurrentlyBorrowedByUser);
        }       
    }
}