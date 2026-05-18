FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5085

ENV ASPNETCORE_URLS=http://+:5085

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["BookTrack.csproj", "./"]
RUN dotnet restore "BookTrack.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "BookTrack.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "BookTrack.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BookTrack.dll"]
