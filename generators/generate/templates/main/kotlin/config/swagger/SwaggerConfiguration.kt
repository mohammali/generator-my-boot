package <%= packageSignature %>.config.swagger

import com.google.common.base.Predicate
import com.google.common.base.Predicates.or
import org.springframework.boot.autoconfigure.web.ServerProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import springfox.documentation.builders.ApiInfoBuilder
import springfox.documentation.builders.PathSelectors.regex
import springfox.documentation.builders.RequestHandlerSelectors
import springfox.documentation.service.ApiInfo
import springfox.documentation.service.Contact
import springfox.documentation.spi.DocumentationType
import springfox.documentation.spring.web.plugins.Docket
import springfox.documentation.swagger2.annotations.EnableSwagger2

@EnableSwagger2
@Configuration
class SwaggerConfiguration(val swaggerProperties: SwaggerProperties, val serverProperties: ServerProperties) {

  @Bean
  fun documentation(): Docket =
    Docket(DocumentationType.SWAGGER_2)
      .select()
      .apis(RequestHandlerSelectors.any())
      .paths(paths())
      .build()
      .pathMapping("/")
      .protocols(protocols())
      .apiInfo(apiInfo())

  private fun protocols(): MutableSet<String> =
    mutableSetOf<String>().apply {
      if (serverProperties.ssl?.isEnabled == true) {
        add("https")
      } else {
        add("http")
      }
    }

  private fun apiInfo(): ApiInfo =
    ApiInfoBuilder()
      .title(swaggerProperties.title)
      .description(swaggerProperties.description)
      .termsOfServiceUrl(swaggerProperties.termsPath)
      .contact(Contact("", "", swaggerProperties.email))
      .license(swaggerProperties.licenceType)
      .licenseUrl(swaggerProperties.licencePath)
      .version(swaggerProperties.version)
      .build()

  private fun paths(): Predicate<String> = or<String>(regex("/api.*"))
}
