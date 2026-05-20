using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserBookRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "UserBooks",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "UserBooks");
        }
    }
}
