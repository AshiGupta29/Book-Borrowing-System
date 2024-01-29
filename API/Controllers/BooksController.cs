using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Specifications;
using API.Dtos;
using AutoMapper;
using API.Errors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.Extensions;

namespace API.Controllers
{
    public class BooksController : BaseApiController
    {
        private readonly UserManager<User> userManager;
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;

        public BooksController(IMapper mapper, IUnitOfWork unitOfWork, UserManager<User> userManager)
        {
            this.mapper = mapper;
            this.userManager = userManager;
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<BookToReturnDto>> GetBooks([FromQuery] BookSpecParams bookParams)
        {
            var spec = new BooksWithSearchSpecification(bookParams);
            var books = await this.unitOfWork.Repository<Book>()
                .ListAsync(
                    spec,
                    b => b.LentByUser,
                    b => b.CurrentlyBorrowedByUser
                );

            var data = books.Select(book =>
            {
                var dto = this.mapper.Map<Book, BookToReturnDto>(book);
                dto.LentByUser = book.LentByUser?.Firstname + " " + book.LentByUser?.Lastname;
                dto.LentByUserId = book.LentByUserId;
                if (dto.CurrentlyBorrowedByUser != null)
                { dto.CurrentlyBorrowedByUser = book.CurrentlyBorrowedByUser?.Firstname + " " + book.CurrentlyBorrowedByUser?.Lastname; }
                return dto;
            }).ToList();

            return Ok(data);
        }


        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BookToReturnDto>> GetBooks(int id)
        {
            var spec = new BooksWithSearchSpecification(id);
            var book = await this.unitOfWork.Repository<Book>().GetEntityWithSpec(spec);

            if (book == null) return NotFound(new ApiResponse(404));
            var bookDto = this.mapper.Map<Book, BookToReturnDto>(book);

            // Fetch first name and last name for LentByUser
            bookDto.LentByUser = $"{book.LentByUser?.Firstname} {book.LentByUser?.Lastname}";

            // Fetch first name and last name for CurrentlyBorrowedByUser
            bookDto.CurrentlyBorrowedByUser = $"{book.CurrentlyBorrowedByUser?.Firstname} {book.CurrentlyBorrowedByUser?.Lastname}";

            return Ok(bookDto);
        }

        [HttpGet("{userId}")]
        [Route("myLentedBooks/{userId}")]
        public async Task<ActionResult<BookToReturnDto>> GetMyLentedBooks(int userId)
        {
            var spec = new BooksLentedByUsersSpecification(userId);

            // Retrieve the books
            var books = await this.unitOfWork.Repository<Book>().ListAsync(spec);

            // Map the books to DTOs
            var data = this.mapper.Map<IReadOnlyList<Book>, IReadOnlyList<BookToReturnDto>>(books);

            return Ok(data);
        }

        [HttpGet("{userId}")]
        [Route("myBorrowedBooks/{userId}")]
        public async Task<ActionResult<BookToReturnDto>> GetMyBorrowedBooks(int userId)
        {
            var spec = new BooksBorrowedByUsersSpecification(userId);

            // Retrieve the books
            var books = await this.unitOfWork.Repository<Book>().ListAsync(spec);

            // Map the books to DTOs
            var data = this.mapper.Map<IReadOnlyList<Book>, IReadOnlyList<BookToReturnDto>>(books);

            return Ok(data);
        }

        [HttpPost]
        public async Task<ActionResult<Book>> AddBook([FromBody] BookToCreateDto bookDto)
        {
            var book = mapper.Map<BookToCreateDto, Book>(bookDto);

            unitOfWork.Repository<Book>().Add(book);
            await unitOfWork.Complete();

            var createdBookDto = mapper.Map<Book, BookToCreateDto>(book);
            return CreatedAtAction(nameof(GetBooks), new { id = createdBookDto.Name }, createdBookDto);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBook(int id)
        {
            // Get the car from the repository
            var book = await this.unitOfWork.Repository<Book>().GetByIdAsync(id);
            if (book == null)
            {
                return NotFound(new ApiResponse(404));
            }

            // Delete the car from the repository
            this.unitOfWork.Repository<Book>().Delete(book);
            await this.unitOfWork.Complete();

            // Return a success response
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Book>> UpdateProduct(int id, [FromBody] BookToCreateDto bookDto)
        {
            // Get the product from the repository
            var book = await this.unitOfWork.Repository<Book>().GetByIdAsync(id);
            if (book == null)
            {
                return NotFound(new ApiResponse(404));
            }

            if (!bookDto.IsBookAvailable)
            {
                // Deduct 1 token from CurrentlyBorrowedByUser
                var borrower = await this.userManager.FindByIdAsync(bookDto.CurrentlyBorrowedByUserId.ToString());
                if (borrower != null && borrower.TokensAvailable > 0)
                {
                    borrower.TokensAvailable -= 1;
                    await this.userManager.UpdateAsync(borrower);
                }

                // Add 1 token to LentByUser
                var lender = await this.userManager.FindByIdAsync(bookDto.LentByUserId.ToString());
                if (lender != null)
                {
                    lender.TokensAvailable += 1;
                    await this.userManager.UpdateAsync(lender);
                }
            }

            mapper.Map(bookDto, book);
            // Save the changes to the repository
            unitOfWork.Repository<Book>().Update(book);
            await this.unitOfWork.Complete();

            // Return the updated product
            return book;
        }

    }
}