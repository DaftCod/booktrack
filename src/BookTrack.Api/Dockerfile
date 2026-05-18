FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5085
ENV ASPNETCORE_URLS=http://+:5085

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG configuration=Release
WORKDIR /src

# Copy props first for layer caching
COPY ["Directory.Build.props", "./"]
COPY ["Directory.Packages.props", "./"]

# Copy csproj files for restore caching
COPY ["src/BookTrack.Domain/BookTrack.Domain.csproj", "src/BookTrack.Domain/"]
COPY ["src/BookTrack.Application/BookTrack.Application.csproj", "src/BookTrack.Application/"]
COPY ["src/BookTrack.Infrastructure/BookTrack.Infrastructure.csproj", "src/BookTrack.Infrastructure/"]
COPY ["src/BookTrack.Api/BookTrack.Api.csproj", "src/BookTrack.Api/"]

RUN dotnet restore "src/BookTrack.Api/BookTrack.Api.csproj"

COPY . .
RUN dotnet build "src/BookTrack.Api/BookTrack.Api.csproj" -c $configuration -o /app/build --no-restore

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "src/BookTrack.Api/BookTrack.Api.csproj" -c $configuration -o /app/publish /p:UseAppHost=false --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BookTrack.Api.dll"]
