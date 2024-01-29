using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
         public MappingProfiles()
        {
            CreateMap<Book, BookToReturnDto>().ReverseMap();
            CreateMap<BookToCreateDto,Book>().ReverseMap();
           
        }
    }
}