using System.Runtime.CompilerServices;
using FluentAssertions;
using NetArchTest.Rules;
using Xunit;

namespace BookTrack.Architecture.Tests;

public class LayeringTests
{
    private const string DomainNs = "BookTrack.Domain";
    private const string ApplicationNs = "BookTrack.Application";
    private const string InfrastructureNs = "BookTrack.Infrastructure";
    private const string ApiNs = "BookTrack.Api";

    [Fact]
    public void Domain_Must_Not_Reference_Application()
        => Types.InAssembly(typeof(Domain.AssemblyReference).Assembly)
            .ShouldNot().HaveDependencyOn(ApplicationNs)
            .GetResult().IsSuccessful.Should().BeTrue();

    [Fact]
    public void Domain_Must_Not_Reference_Infrastructure()
        => Types.InAssembly(typeof(Domain.AssemblyReference).Assembly)
            .ShouldNot().HaveDependencyOn(InfrastructureNs)
            .GetResult().IsSuccessful.Should().BeTrue();

    [Fact]
    public void Domain_Must_Not_Reference_Api()
        => Types.InAssembly(typeof(Domain.AssemblyReference).Assembly)
            .ShouldNot().HaveDependencyOn(ApiNs)
            .GetResult().IsSuccessful.Should().BeTrue();

    [Fact]
    public void Application_Must_Not_Reference_Infrastructure()
        => Types.InAssembly(typeof(Application.AssemblyReference).Assembly)
            .ShouldNot().HaveDependencyOn(InfrastructureNs)
            .GetResult().IsSuccessful.Should().BeTrue();

    [Fact]
    public void Application_Must_Not_Reference_Api()
        => Types.InAssembly(typeof(Application.AssemblyReference).Assembly)
            .ShouldNot().HaveDependencyOn(ApiNs)
            .GetResult().IsSuccessful.Should().BeTrue();

    [Fact]
    public void Infrastructure_Must_Not_Reference_Api()
        => Types.InAssembly(typeof(Infrastructure.AssemblyReference).Assembly)
            .ShouldNot().HaveDependencyOn(ApiNs)
            .GetResult().IsSuccessful.Should().BeTrue();

    [Fact]
    public void Domain_Types_Should_Live_In_Domain_Namespace()
        => Types.InAssembly(typeof(Domain.AssemblyReference).Assembly)
            .That().DoNotHaveCustomAttribute(typeof(CompilerGeneratedAttribute))
            .Should().ResideInNamespace(DomainNs)
            .GetResult().IsSuccessful.Should().BeTrue();

    [Fact]
    public void Application_Types_Should_Live_In_Application_Namespace()
        => Types.InAssembly(typeof(Application.AssemblyReference).Assembly)
            .That().DoNotHaveCustomAttribute(typeof(CompilerGeneratedAttribute))
            .Should().ResideInNamespace(ApplicationNs)
            .GetResult().IsSuccessful.Should().BeTrue();

    [Fact]
    public void Infrastructure_Types_Should_Live_In_Infrastructure_Namespace()
        => Types.InAssembly(typeof(Infrastructure.AssemblyReference).Assembly)
            .That().DoNotHaveCustomAttribute(typeof(CompilerGeneratedAttribute))
            .Should().ResideInNamespace(InfrastructureNs)
            .GetResult().IsSuccessful.Should().BeTrue();
}
