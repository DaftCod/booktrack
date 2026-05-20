using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Authors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    LastName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Bio = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Authors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Isbn = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    PublishedYear = table.Column<int>(type: "integer", nullable: true),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    CoverImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    PageCount = table.Column<int>(type: "integer", nullable: true),
                    AverageRating = table.Column<double>(type: "double precision", nullable: false, defaultValue: 0.0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Genres",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BookAuthor",
                columns: table => new
                {
                    BookId = table.Column<Guid>(type: "uuid", nullable: false),
                    AuthorId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookAuthor", x => new { x.BookId, x.AuthorId });
                    table.ForeignKey(
                        name: "FK_BookAuthor_Authors_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Authors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookAuthor_Books_BookId",
                        column: x => x.BookId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookGenre",
                columns: table => new
                {
                    BookId = table.Column<Guid>(type: "uuid", nullable: false),
                    GenreId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookGenre", x => new { x.BookId, x.GenreId });
                    table.ForeignKey(
                        name: "FK_BookGenre_Books_BookId",
                        column: x => x.BookId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookGenre_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Authors",
                columns: new[] { "Id", "Bio", "FirstName", "LastName" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0002-000000000001"), "American author of epic fantasy.", "Patrick", "Rothfuss" },
                    { new Guid("00000000-0000-0000-0002-000000000002"), "American author known for hard science fiction.", "Andy", "Weir" },
                    { new Guid("00000000-0000-0000-0002-000000000003"), "New York Times bestselling author of cozy fantasy.", "TJ", "Klune" },
                    { new Guid("00000000-0000-0000-0002-000000000004"), "USA Today and Wall Street Journal bestselling author.", "Rebecca", "Yarros" },
                    { new Guid("00000000-0000-0000-0002-000000000005"), "American author and creative director.", "Bonnie", "Garmus" },
                    { new Guid("00000000-0000-0000-0002-000000000006"), "English author, screenwriter, and humorist.", "Douglas", "Adams" },
                    { new Guid("00000000-0000-0000-0002-000000000007"), "English novelist known for her romantic fiction.", "Jane", "Austen" },
                    { new Guid("00000000-0000-0000-0002-000000000008"), "British author for children and adults.", "Matt", "Haig" },
                    { new Guid("00000000-0000-0000-0002-000000000009"), "New York Times and internationally bestselling author.", "Sarah J.", "Maas" },
                    { new Guid("00000000-0000-0000-0002-000000000010"), "American author of contemporary fiction.", "Taylor Jenkins", "Reid" }
                });

            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "AverageRating", "CoverImageUrl", "Description", "Isbn", "PageCount", "PublishedYear", "Title" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0001-000000000001"), 4.5499999999999998, "https://covers.openlibrary.org/b/isbn/9780756404741-L.jpg", "A young man grows to be the most notorious wizard his world has ever seen, told in his own words.", "9780756404741", 662, 2007, "The Name of the Wind" },
                    { new Guid("00000000-0000-0000-0001-000000000002"), 4.5199999999999996, "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg", "A lone astronaut must save the Earth from disaster in this propulsive science-fiction adventure.", "9780593135204", 476, 2021, "Project Hail Mary" },
                    { new Guid("00000000-0000-0000-0001-000000000003"), 4.2599999999999998, "https://covers.openlibrary.org/b/isbn/9781250217288-L.jpg", "A magical story about love, family, and what makes a person good or evil.", "9781250217288", 394, 2020, "The House in the Cerulean Sea" },
                    { new Guid("00000000-0000-0000-0001-000000000004"), 4.1699999999999999, "https://covers.openlibrary.org/b/isbn/9781649374042-L.jpg", "In a world where dragons choose their riders, one girl must survive the most dangerous year of her life.", "9781649374042", 517, 2023, "Fourth Wing" },
                    { new Guid("00000000-0000-0000-0001-000000000005"), 4.0599999999999996, "https://covers.openlibrary.org/b/isbn/9780385547345-L.jpg", "A female scientist becomes America's most beloved cooking show host in 1960s California.", "9780385547345", 390, 2022, "Lessons in Chemistry" },
                    { new Guid("00000000-0000-0000-0001-000000000006"), 4.2199999999999998, "https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg", "Seconds before the Earth is demolished for a bypass, Arthur Dent is swept into a madcap tour of the universe.", "9780345391803", 193, 1979, "The Hitchhiker's Guide to the Galaxy" },
                    { new Guid("00000000-0000-0000-0001-000000000007"), 4.2800000000000002, "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg", "The beloved story of Elizabeth Bennet and the proud Mr. Darcy in Regency England.", "9780141439518", 432, 1813, "Pride and Prejudice" },
                    { new Guid("00000000-0000-0000-0001-000000000008"), 3.9900000000000002, "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg", "Between life and death lies the Midnight Library — a place to try all the lives you could have lived.", "9780525559474", 304, 2020, "The Midnight Library" },
                    { new Guid("00000000-0000-0000-0001-000000000009"), 4.1500000000000004, "https://covers.openlibrary.org/b/isbn/9781635575569-L.jpg", "A young mortal girl is whisked away to a magical land where the stakes are much higher than she imagined.", "9781635575569", 419, 2015, "A Court of Thorns and Roses" },
                    { new Guid("00000000-0000-0000-0001-000000000010"), 4.4199999999999999, "https://covers.openlibrary.org/b/isbn/9781501161933-L.jpg", "Reclusive Hollywood legend Evelyn Hugo finally reveals the truth about her glamorous and scandalous life.", "9781501161933", 389, 2017, "The Seven Husbands of Evelyn Hugo" }
                });

            migrationBuilder.InsertData(
                table: "Genres",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0003-000000000001"), "Fantasy" },
                    { new Guid("00000000-0000-0000-0003-000000000002"), "Science Fiction" },
                    { new Guid("00000000-0000-0000-0003-000000000003"), "Romance" },
                    { new Guid("00000000-0000-0000-0003-000000000004"), "Historical Fiction" },
                    { new Guid("00000000-0000-0000-0003-000000000005"), "Classic" },
                    { new Guid("00000000-0000-0000-0003-000000000006"), "Cozy Fantasy" },
                    { new Guid("00000000-0000-0000-0003-000000000007"), "Comedy" },
                    { new Guid("00000000-0000-0000-0003-000000000008"), "Literary Fiction" }
                });

            migrationBuilder.InsertData(
                table: "BookAuthor",
                columns: new[] { "AuthorId", "BookId" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0002-000000000001"), new Guid("00000000-0000-0000-0001-000000000001") },
                    { new Guid("00000000-0000-0000-0002-000000000002"), new Guid("00000000-0000-0000-0001-000000000002") },
                    { new Guid("00000000-0000-0000-0002-000000000003"), new Guid("00000000-0000-0000-0001-000000000003") },
                    { new Guid("00000000-0000-0000-0002-000000000004"), new Guid("00000000-0000-0000-0001-000000000004") },
                    { new Guid("00000000-0000-0000-0002-000000000005"), new Guid("00000000-0000-0000-0001-000000000005") },
                    { new Guid("00000000-0000-0000-0002-000000000006"), new Guid("00000000-0000-0000-0001-000000000006") },
                    { new Guid("00000000-0000-0000-0002-000000000007"), new Guid("00000000-0000-0000-0001-000000000007") },
                    { new Guid("00000000-0000-0000-0002-000000000008"), new Guid("00000000-0000-0000-0001-000000000008") },
                    { new Guid("00000000-0000-0000-0002-000000000009"), new Guid("00000000-0000-0000-0001-000000000009") },
                    { new Guid("00000000-0000-0000-0002-000000000010"), new Guid("00000000-0000-0000-0001-000000000010") }
                });

            migrationBuilder.InsertData(
                table: "BookGenre",
                columns: new[] { "BookId", "GenreId" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0001-000000000001"), new Guid("00000000-0000-0000-0003-000000000001") },
                    { new Guid("00000000-0000-0000-0001-000000000002"), new Guid("00000000-0000-0000-0003-000000000002") },
                    { new Guid("00000000-0000-0000-0001-000000000003"), new Guid("00000000-0000-0000-0003-000000000001") },
                    { new Guid("00000000-0000-0000-0001-000000000003"), new Guid("00000000-0000-0000-0003-000000000003") },
                    { new Guid("00000000-0000-0000-0001-000000000003"), new Guid("00000000-0000-0000-0003-000000000006") },
                    { new Guid("00000000-0000-0000-0001-000000000004"), new Guid("00000000-0000-0000-0003-000000000001") },
                    { new Guid("00000000-0000-0000-0001-000000000004"), new Guid("00000000-0000-0000-0003-000000000003") },
                    { new Guid("00000000-0000-0000-0001-000000000005"), new Guid("00000000-0000-0000-0003-000000000004") },
                    { new Guid("00000000-0000-0000-0001-000000000005"), new Guid("00000000-0000-0000-0003-000000000008") },
                    { new Guid("00000000-0000-0000-0001-000000000006"), new Guid("00000000-0000-0000-0003-000000000002") },
                    { new Guid("00000000-0000-0000-0001-000000000006"), new Guid("00000000-0000-0000-0003-000000000007") },
                    { new Guid("00000000-0000-0000-0001-000000000007"), new Guid("00000000-0000-0000-0003-000000000003") },
                    { new Guid("00000000-0000-0000-0001-000000000007"), new Guid("00000000-0000-0000-0003-000000000005") },
                    { new Guid("00000000-0000-0000-0001-000000000008"), new Guid("00000000-0000-0000-0003-000000000001") },
                    { new Guid("00000000-0000-0000-0001-000000000008"), new Guid("00000000-0000-0000-0003-000000000008") },
                    { new Guid("00000000-0000-0000-0001-000000000009"), new Guid("00000000-0000-0000-0003-000000000001") },
                    { new Guid("00000000-0000-0000-0001-000000000009"), new Guid("00000000-0000-0000-0003-000000000003") },
                    { new Guid("00000000-0000-0000-0001-000000000010"), new Guid("00000000-0000-0000-0003-000000000003") },
                    { new Guid("00000000-0000-0000-0001-000000000010"), new Guid("00000000-0000-0000-0003-000000000004") },
                    { new Guid("00000000-0000-0000-0001-000000000010"), new Guid("00000000-0000-0000-0003-000000000008") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookAuthor_AuthorId",
                table: "BookAuthor",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_BookGenre_GenreId",
                table: "BookGenre",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_Genres_Name",
                table: "Genres",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookAuthor");

            migrationBuilder.DropTable(
                name: "BookGenre");

            migrationBuilder.DropTable(
                name: "Authors");

            migrationBuilder.DropTable(
                name: "Books");

            migrationBuilder.DropTable(
                name: "Genres");
        }
    }
}
